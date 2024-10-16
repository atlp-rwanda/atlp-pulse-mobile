import OrgLogin from '@/components/Login/OrgLogin';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

describe('<OrgLogin />', () => {
  const mockSubmit = jest.fn();

  test('renders text content correctly', () => {
    const { getByText } = render(<OrgLogin onSubmit={mockSubmit} />);

    getByText('Sign in to your Organization');
    getByText("Enter your organization's Pulse URL");
    getByText('Continue');
  });

  test('renders the organization input field and accepts input', () => {
    const { getByPlaceholderText, getByTestId } = render(<OrgLogin onSubmit={mockSubmit} />);
    const orgInput = getByPlaceholderText('<Your-organization>');

    expect(orgInput).toBeTruthy();

    fireEvent.changeText(orgInput, 'myorg');

    expect(getByTestId('org-input').props.value).toBe('myorg');

    const pulse_co = getByTestId('pulse.co');
    expect(pulse_co).toBeTruthy();
    expect(pulse_co.props.children).toBe('.pulse.co');

    fireEvent.changeText(orgInput, 'MyOrganization');
    expect(orgInput.props.value).toBe('MyOrganization');

    const expectedWidth = Math.min('MyOrganization'.length * 11, 200);
    expect(orgInput.props.style.width).toBe(expectedWidth);
  });

  test('shows validation error if input is empty and submitted', async () => {
    const { getByTestId, getByText } = render(<OrgLogin onSubmit={mockSubmit} />);

    const submitButton = getByTestId('submit-button');

    fireEvent.press(submitButton);

    await waitFor(() => {
      getByText('Organization URL is required');
    });
  });

  test('calls onSubmit with the correct data when form is valid', async () => {
    const { getByTestId, getByPlaceholderText } = render(<OrgLogin onSubmit={mockSubmit} />);

    const orgInput = getByPlaceholderText('<Your-organization>');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(orgInput, 'myorg.pulse.co');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({ organization: 'myorg.pulse.co' });
    });
  });
});
