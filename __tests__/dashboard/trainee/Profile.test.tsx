import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '@/app/dashboard/trainee/Profile';
import '@testing-library/jest-native/extend-expect';
import { useQuery } from '@apollo/client';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
}));

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native-toast-notifications', () => ({
  useToast: jest.fn(),
}));

describe('<Profile />', () => {
  const mockUseQuery = useQuery as jest.Mock;
  const mockUseColorScheme = useColorScheme as jest.Mock;
  const mockGetItem = AsyncStorage.getItem as jest.Mock;
  const mockUseToast = useToast as jest.Mock;
  const showMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    mockGetItem.mockResolvedValue('mockToken');
    mockUseToast.mockReturnValue({ show: showMock });
  });

  test('renders profile information correctly', async () => {
    mockUseQuery.mockReturnValue({
      data: {
        getProfile: {
          avatar: 'https://example.com/avatar.png',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '1234567890',
          address: '123 Main St',
          resume: 'https://example.com/resume.pdf',
          biography: 'This is a biography.',
        },
      },
      loading: false,
      error: null,
    });

    const { getByText, getByTestId } = render(<Profile />);

    await waitFor(() => {
      expect(getByTestId('avatar')).toBeTruthy();
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john.doe@example.com')).toBeTruthy();
      expect(getByText('1234567890')).toBeTruthy();
      expect(getByText('123 Main St')).toBeTruthy();
      expect(getByText('https://example.com/resume.pdf')).toBeTruthy();
      expect(getByText('This is a biography.')).toBeTruthy();
    });
  });

  test('displays error message when token is not found', async () => {
    mockGetItem.mockResolvedValue(null);

    render(<Profile />);

    await waitFor(() => {
      expect(showMock).toHaveBeenCalledWith('Token Not found.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
    });
  });

  test('handles tab switching correctly', async () => {
    mockUseQuery.mockReturnValue({
      data: {
        getProfile: {
          avatar: 'https://example.com/avatar.png',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '1234567890',
          address: '123 Main St',
          resume: 'https://example.com/resume.pdf',
          biography: 'This is a biography.',
        },
      },
      loading: false,
      error: null,
    });

    const { getByText } = render(<Profile />);

    fireEvent.press(getByText('Organisation'));

    await waitFor(() => {
      expect(getByText('YOUR ORGANISATION DETAILS')).toBeTruthy();
      expect(getByText('Andela')).toBeTruthy();
      expect(getByText('devpulse@proton.me')).toBeTruthy();
      expect(getByText('trainee')).toBeTruthy();
    });

    fireEvent.press(getByText('About'));

    await waitFor(() => {
      expect(getByText('BASIC INFORMATION')).toBeTruthy();
      expect(getByText('John Doe')).toBeTruthy();
    });
  });

  test('displays loading state correctly', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { getByTestId } = render(<Profile />);

    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  test('displays error message when query fails', async () => {
    mockUseQuery.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Failed to fetch profile'),
    });

    render(<Profile />);

    await waitFor(() => {
      expect(showMock).toHaveBeenCalledWith('Error fetching profile.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
      });
    });
  });

  test('renders default profile image when no avatar is provided', async () => {
    mockUseQuery.mockReturnValue({
      data: {
        getProfile: {
          avatar: null,
          name: 'John Doe',
        },
      },
      loading: false,
      error: null,
    });

    const { getByTestId } = render(<Profile />);

    await waitFor(() => {
      expect(getByTestId('default-avatar')).toBeTruthy();
    });
  });

  test('handles edit button press', async () => {
    mockUseQuery.mockReturnValue({
      data: {
        getProfile: {
          avatar: 'https://example.com/avatar.png',
          name: 'John Doe',
        },
      },
      loading: false,
      error: null,
    });

    const { getByTestId } = render(<Profile />);

    fireEvent.press(getByTestId('edit-button'));

    await waitFor(() => {
      expect(showMock).toHaveBeenCalledWith('Edit button pressed', {
        type: 'info',
        placement: 'top',
        duration: 3000,
      });
    });
  });

  test('handles color scheme change', async () => {
    mockUseColorScheme.mockReturnValue('dark');

    mockUseQuery.mockReturnValue({
      data: {
        getProfile: {
          avatar: 'https://example.com/avatar.png',
          name: 'John Doe',
        },
      },
      loading: false,
      error: null,
    });

    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText('John Doe')).toHaveStyle({ color: 'text-gray-100' });
    });
  });
});
