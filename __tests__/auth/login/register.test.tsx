import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import RegisterForm from '@/app/auth/register';
import { SIGN_UP_MUTATION } from '@/graphql/mutations/register.mutation';

const mocks = [
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        email: 'john.doe@example.com',
        password: 'password123',
        orgToken: 'token123',
      },
    },
    result: {
      data: {
        createUser: {
          token: 'mocked_token',
        },
      },
    },
  },
];

describe('RegisterForm', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>
    );

    expect(getByText('Register Your Account!')).toBeTruthy();
  });

  it('submits the form successfully', async () => {
    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('First Name:'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name:'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email:'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Password:'), 'password123');
    
    // Simulate selecting gender and date of birth
    fireEvent.press(getByText('Gender:')); // Adjust based on your Picker implementation
    fireEvent.press(getByText('male')); // Assuming you have a button or option to select gender
    fireEvent.press(getByText('Date of Birth:')); // Adjust based on your DatePicker implementation
    fireEvent.press(getByText('1990-01-01')); // Select a date

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Successfully registered')).toBeTruthy();
    });
  });

  it('shows an error message when submission fails', async () => {
    const errorMocks = [
      {
        request: {
          query: SIGN_UP_MUTATION,
          variables: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            email: 'john.doe@example.com',
            password: 'password123',
            orgToken: 'token123',
          },
        },
        error: new Error('Submission error'),
      },
    ];

    const { getByPlaceholderText, getByText } = render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>
    );

    fireEvent.changeText(getByPlaceholderText('First Name:'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name:'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email:'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Password:'), 'password123');

    // Simulate selecting gender and date of birth
    fireEvent.press(getByText('Gender:')); // Adjust based on your Picker implementation
    fireEvent.press(getByText('male'));
    
    fireEvent.press(getByText('Date of Birth:')); // Adjust based on your DatePicker implementation
    fireEvent.press(getByText('1990-01-01'));

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Error: Submission error')).toBeTruthy();
    });
  });
});