import AppOnboarding from '@/app/(onboarding)';
import { render } from '@testing-library/react-native';

import React from 'react';

describe('<AppOnboarding />', () => {
  test('Text renders correctly on AppOnboarding', () => {
    const { getByText } = render(<AppOnboarding />);

    getByText("Optimize your organization's potential with Performance Management/Analytics.");

    getByText('Identify top performers, discover hidden talent, and optimize your workforce.');

    getByText('Unlock the potential of a Continuous & Tight Feedback Loop.');

    getByText('Get Started');
  });
});
