import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useToast } from 'react-native-toast-notifications';
import SetNewPassword from '@/app/auth/reset-password';
import { MockedProvider } from '@apollo/client/testing';
import { FORGOT_PASSWORD, VERIFY_RESET_PASSWORD_TOKEN } from '@/graphql/mutations/resetPassword';

jest.mock('react-native-toast-notifications', () => ({
  useToast: jest.fn(),
}));

const mockShowToast = jest.fn();
useToast.mockReturnValue({ show: mockShowToast });

const mocks = [
  {
    request: {
      query: VERIFY_RESET_PASSWORD_TOKEN,
      variables: { token: 'mockedToken' },
    },
    result: {
      data: {},
    },
  },
  {
    request: {
      query: FORGOT_PASSWORD,
      variables: {
        password: 'newPassword123',
        confirmPassword: 'newPassword123',
        token: 'mockedToken',
      },
    },
    result: {
      data: {},
    },
  },
];

describe('<SetNewPassword />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SetNewPassword />
      </MockedProvider>
    );

    getByText('Reset Password');
  });

  test('toggles password visibility', () => {
    const { getByPlaceholderText, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SetNewPassword />
      </MockedProvider>
    );

    const passwordInput = getByPlaceholderText('Password');
    const toggleButton = getByRole('button', { name: /eye/i });

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  test('shows error message when form submission fails', async () => {
    const errorMock = [
      {
        request: {
          query: FORGOT_PASSWORD,
          variables: {
            password: 'newPassword123',
            confirmPassword: 'newPassword123',
            token: 'mockedToken',
          },
        },
        error: new Error('Failed to reset password'),
      },
    ];

    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <SetNewPassword />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Password'), 'newPassword123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'newPassword123');

    fireEvent.press(getByText('Continue'));

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith('Failed to reset password', expect.anything())
    );
  });

  test('submits the form with valid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SetNewPassword />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Password'), 'newPassword123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'newPassword123');

    fireEvent.press(getByText('Continue'));

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        'You have successfully reset your password!',
        expect.anything()
      )
    );
  });
});
