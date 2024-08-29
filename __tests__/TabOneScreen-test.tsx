import { render } from '@testing-library/react-native';

import TabOneScreen,  { CustomText }  from '@/app/(tabs)/index';
import React from 'react';

describe('<TabOneScreen />', () => {
  test('Text renders correctly on TabOneScreen', () => {
    const { getByText } = render(<TabOneScreen />);

    getByText('Tab One');
  });

  test('CustomText renders correctly', () => {
    const tree = render(<CustomText>Some text</CustomText>).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
