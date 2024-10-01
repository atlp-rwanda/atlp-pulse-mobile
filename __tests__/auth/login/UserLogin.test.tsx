import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserLogin from '@/components/Login/UserLogin';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('Test Organization')),
}));

describe('UserLogin Component', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches organization name from AsyncStorage', async () => {
    const { getByText } = render(<UserLogin onSubmit={mockOnSubmit} />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('orgName'));
    expect(getByText('Welcome to Test Organization')).toBeTruthy();
  });

  it('submits form successfully when fields are valid', async () => {
    const { getByPlaceholderText, getByText } = render(<UserLogin onSubmit={mockOnSubmit} />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'ValidPassword');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'ValidPassword',
    }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows validation error messages for empty fields', async () => {
    const { getByText } = render(<UserLogin onSubmit={mockOnSubmit} />);

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('navigates to reset password when "Forgot Password?" is pressed', () => {
    const { getByText } = render(<UserLogin onSubmit={mockOnSubmit} />);

    fireEvent.press(getByText('Forgot Password?'));
    expect(router.push).toHaveBeenCalledWith('/auth/forgot-password');
  });

  it('toggles password visibility when eye icon is pressed', () => {
    const { getByPlaceholderText, getByTestId } = render(<UserLogin onSubmit={mockOnSubmit} />);

    const passwordInput = getByPlaceholderText('Password');
    const toggleIcon = getByTestId('password-toggle');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleIcon);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleIcon);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });
});
