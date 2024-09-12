import { render } from '@testing-library/react-native';

import Dashboard from '@/app/dashboard/index';

describe('<Dashboard />', () => {
  test('Text renders correctly on Dashboard', () => {
    const { getByText } = render(<Dashboard />);

    getByText('Dashboard.');
  });
});
