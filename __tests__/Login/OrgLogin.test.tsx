import OrgLogin from '@/components/Login/OrgLogin';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

describe('<OrgLogin />', () => {
  const mockSubmit = jest.fn();

  test('renders text content correctly', () => {
    const { getByText } = render(<OrgLogin onSubmit={mockSubmit} />);

    getByText('Sign in to your Organization');
    getByText("Enter your organization's Pulse URL");
    getByText('Looking to register an organization instead?');
    getByText('Sign up');
  });

  test('renders the organization input field and accepts input', () => {
    const { getByPlaceholderText, getByTestId } = render(<OrgLogin onSubmit={mockSubmit} />);
    const orgInput = getByPlaceholderText('<Your-organization>.pulse.co');

    expect(orgInput).toBeTruthy();

    fireEvent.changeText(orgInput, 'myorg');

    expect(getByTestId('org-input').props.value).toBe('myorg');
  });

  test('shows validation error if input is empty and submitted', async () => {
    const { getByTestId, getByText } = render(<OrgLogin onSubmit={mockSubmit} />);

    const submitButton = getByTestId('submit-button');

    fireEvent.press(submitButton);

    await waitFor(() => {
      getByText('organization is a required field');
    });
  });

  test('calls onSubmit with the correct data when form is valid', async () => {
    const { getByTestId, getByPlaceholderText } = render(<OrgLogin onSubmit={mockSubmit} />);

    const orgInput = getByPlaceholderText('<Your-organization>.pulse.co');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(orgInput, 'myorg.pulse.co');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ organization: 'myorg.pulse.co' });
    });
  });

  test('displays loading indicator during form submission', async () => {
    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <OrgLogin onSubmit={mockSubmit} />
    );

    const orgInput = getByPlaceholderText('<Your-organization>.pulse.co');
    const submitButton = getByTestId('submit-button');
    fireEvent.changeText(orgInput, 'myorg.pulse.co');
    mockSubmit.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    fireEvent.press(submitButton);
    expect(queryByTestId('activity-indicator')).toBeTruthy();
  });
});
