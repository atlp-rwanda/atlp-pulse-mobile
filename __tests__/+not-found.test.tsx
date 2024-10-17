import NotFoundScreen from '@/app/+not-found';
import { render } from '@testing-library/react-native';

describe('<NotFoundScreen />', () => {
  test('Screen renders correctly on NotFoundScreen', () => {
    const { getByText } = render(<NotFoundScreen />);

    getByText("Oops! We can't find the page you're looking for.");
    getByText('Go to home screen!');
  });
});
