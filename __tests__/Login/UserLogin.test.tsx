import UserLogin from '@/components/Login/UserLogin';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

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
      getByText('Email is required');
      getByText('Password is required');
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

  test('toggles password visibility', () => {
    const { getByLabelText, getByPlaceholderText } = render(<UserLogin onSubmit={onSubmitMock} />);

    const passwordInput = getByPlaceholderText('Password');
    const toggleButton = getByLabelText('Toggle password visibility');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });
});
