import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter, usePathname } from 'expo-router';
import Sidebar from '@/components/sidebar'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the expo-router hooks
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock the SvgXml component
jest.mock('react-native-svg', () => ({
  SvgXml: 'SvgXml',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

describe('Sidebar', () => {
  const mockOnClose = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  it('renders correctly', () => {
    const { getByText } = render(<Sidebar onClose={mockOnClose} />);
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Attendance')).toBeTruthy();
    expect(getByText('Performance')).toBeTruthy();
    expect(getByText('Calendar')).toBeTruthy();
    expect(getByText('Docs')).toBeTruthy();
    expect(getByText('Help')).toBeTruthy();
    expect(getByText('LogOut')).toBeTruthy();
  });

  it('highlights the active item based on current pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/trainee');
    const { getByText } = render(<Sidebar onClose={mockOnClose} />);
    const attendanceItem = getByText('Attendance').parent;
    expect(attendanceItem?.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: expect.stringContaining('indigo'),
      })
    );
  });

  it('calls onClose when close button is pressed', () => {
    const { getByTestId } = render(<Sidebar onClose={mockOnClose} />);
    const closeButton = getByTestId('close-button');
    fireEvent.press(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('navigates and closes sidebar when an item is pressed', async () => {
    const { getByText } = render(<Sidebar onClose={mockOnClose} />);
    fireEvent.press(getByText('Attendance'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/trainee');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles logout correctly', async () => {
    const { getByText } = render(<Sidebar onClose={mockOnClose} />);
    fireEvent.press(getByText('Sign out'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });
});
