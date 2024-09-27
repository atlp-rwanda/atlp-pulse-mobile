import UserLogin from '@/components/Login/UserLogin';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

describe('<UserLogin />', () => {
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders text correctly', () => {
    const { getByText } = render(<UserLogin onSubmit={onSubmitMock} />);

    getByText('Welcome to your_organization_name');
    getByText('Switch your organization');
    getByText('Sign In');
    getByText('Forgot Password?');
    getByText('Remember me.');
  });

  test('displays error messages when validation fails', async () => {
    const { getByText, getByPlaceholderText } = render(<UserLogin onSubmit={onSubmitMock} />);

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      getByText('Please provide your email address');
      getByText('Please provide a password');
    });
  });

  test('calls onSubmit with correct values', async () => {
    const { getByPlaceholderText, getByText } = render(<UserLogin onSubmit={onSubmitMock} />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
  });
});
