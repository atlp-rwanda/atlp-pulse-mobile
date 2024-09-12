import { render } from '@testing-library/react-native';

import TraineeDashboard from '@/app/dashboard/trainee/index';

describe('<TraineeDashboard />', () => {
  test('Text renders correctly on Trainee', () => {
    const { getByText } = render(<TraineeDashboard />);

    getByText('Trainee Dashboard.');
  });
});
