import { render } from '@testing-library/react-native';

import Trainee, { CustomText } from '@/app/trainee/index';

describe('<Trainee />', () => {
  test('Text renders correctly on Trainee', () => {
    const { getByText } = render(<Trainee />);

    getByText('Trainee.');
  });
});
