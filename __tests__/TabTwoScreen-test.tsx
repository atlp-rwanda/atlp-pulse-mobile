import { render } from '@testing-library/react-native';

import TabOTwoScreen,  { CustomText }  from '@/app/(tabs)/two';
import React from 'react';

describe('<TabOTwoScreen />', () => {
  test('Text renders correctly on TabOTwoScreen', () => {
    const { getByText } = render(<TabOTwoScreen />);

    getByText('Tab Two');
  });

  test('CustomText renders correctly', () => {
    const tree = render(<CustomText>Some text</CustomText>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
