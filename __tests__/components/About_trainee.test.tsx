import React from 'react';
import { render } from '@testing-library/react-native';
import AboutTrainee from '../../components/trainee/About';

describe('AboutTrainee Component', () => {
  it('renders correctly', () => {
    const profile = {
      name: 'John Doe',
      user: { email: 'john@example.com' },
    };
    const { getByText } = render(
      <AboutTrainee profile={profile} bgColor="bg-white" textColor="text-black" />
    );
    expect(getByText('BASIC INFORMATION')).toBeTruthy();
  });

  it('renders profile details correctly', () => {
    const mockProfile = {
      name: 'John Doe',
      user: {
        email: 'john.doe@example.com',
      },
      phoneNumber: '+1234567890',
      address: '123 Main St, Anytown',
      githubUsername: 'johnDoeGit',
      resume: 'Available upon request.',
      biography: 'A passionate developer.',
    };

    const { getByText } = render(
      <AboutTrainee profile={mockProfile} bgColor="bg-white" textColor="text-black" />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john.doe@example.com')).toBeTruthy();
    expect(getByText('+1234567890')).toBeTruthy();
    expect(getByText('123 Main St, Anytown')).toBeTruthy();
    expect(getByText('johnDoeGit')).toBeTruthy();
    expect(getByText('Available upon request.')).toBeTruthy();
    expect(getByText('A passionate developer.')).toBeTruthy();
  });
});
