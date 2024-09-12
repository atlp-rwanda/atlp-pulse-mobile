import DatePicker from '@/components/DatePicker';
import { render } from '@testing-library/react-native';

// Mock DefaultDatePicker component from 'react-native-date-picker'
jest.mock('react-native-date-picker', () => {
  return function MockedDatePicker({
    onConfirm,
    onCancel,
    open,
  }: {
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    open: boolean;
  }) {
    if (!open) return null;

    return (
      <div>
        <span data-testid="datepicker-open">DatePicker Open</span>
        <button data-testid="confirm-button" onClick={() => onConfirm(new Date(2022, 11, 24))}>
          Confirm
        </button>
        <button data-testid="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    );
  };
});

// Mock Ionicons component from '@expo/vector-icons'
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('DatePicker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSubmit = jest.fn();

  it('renders the component with default props', () => {
    const { getByText } = render(<DatePicker onSubmit={mockSubmit} />);

    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Select Date')).toBeTruthy();
  });

  it('displays the formatted date when a date is selected', () => {
    const testDate = new Date(2022, 11, 24); // December 24, 2022
    const { getByText } = render(<DatePicker onSubmit={mockSubmit} initialDate={testDate} />);

    expect(getByText('24/12/2022')).toBeTruthy();
  });
});
