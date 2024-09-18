import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import { useToast } from 'react-native-toast-notifications';
import ResetPassword from '@/app/auth/forget/reset-password';
import { RESET_PASSWORD_EMAIL } from '@/graphql/mutations/resetPassword';

jest.mock('react-native-toast-notifications', () => ({
  useToast: jest.fn(),
}));

const mockShowToast = jest.fn();
useToast.mockReturnValue({ show: mockShowToast });

const mocks = [
  {
    request: {
      query: RESET_PASSWORD_EMAIL,
      variables: { email: 'test@example.com' },
    },
    result: {
      data: {},
    },
  },
];

describe('<ResetPassword />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ResetPassword />
      </MockedProvider>
    );

    getByText('Reset Password');
    getByText('You will receive an email to proceed with resetting password');
  });

  test('shows success message after successful email submission', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ResetPassword />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Enter Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith('Check your email to proceed!', expect.anything())
    );

    // Check if the success message is displayed
    expect(getByText('Password reset request successful!')).toBeTruthy();
    expect(getByText('Please check your email for a link to reset your password!')).toBeTruthy();
  });

  test('shows error message when email submission fails', async () => {
    const errorMock = [
      {
        request: {
          query: RESET_PASSWORD_EMAIL,
          variables: { email: 'test@example.com' },
        },
        error: new Error('Failed to send reset email'),
      },
    ];

    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <ResetPassword />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Enter Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith('Failed to send reset email', expect.anything())
    );
  });

  test('displays validation error when submitting empty email', async () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ResetPassword />
      </MockedProvider>
    );

    fireEvent.press(getByText('Continue'));

    // Assuming the validation schema requires an email
    await waitFor(() => expect(getByText(/email/i)).toBeTruthy());
  });

  test('displays loading state while submitting', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ResetPassword />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Enter Email'), 'test@example.com');

    // Press the button and check if it shows loading state
    fireEvent.press(getByText('Continue'));

    expect(getByText('Continue').props.state).toBe('Loading');

    await waitFor(() => expect(getByText('Check your email to proceed!')).toBeTruthy());
  });
});
