import React from 'react';
import { render } from '@testing-library/react-native';
import TraineeOrg from '../../components/trainee/Organisation';

describe('TraineeOrg Component', () => {
	const profile = {
		user: {
			organizations: 'Andela',
			role: 'Trainee',
			team: {
				cohort: {
					program: {
						name: 'Software Engineering',
					},
					name: 'Cohort 1',
					phase: {
						name: 'Phase 1',
					},
				},
				name: 'Team A',
			},
		},
	};

	const pulse = '<svg></svg>';
	const bgColor = 'bg-white';
	const textColor = 'text-black';

	it('renders organization details correctly', () => {
		const { getByText } = render(<TraineeOrg profile={profile}  bgColor={bgColor} textColor={textColor} />);

		expect(getByText('YOUR ORGANISATION DETAILS')).toBeTruthy();
		expect(getByText('Organisation Name:')).toBeTruthy();
		expect(getByText('Andela')).toBeTruthy();
		expect(getByText('Admin email:')).toBeTruthy();
		expect(getByText('devpulse@proton.me')).toBeTruthy();
		expect(getByText('Role:')).toBeTruthy();
		expect(getByText('Trainee')).toBeTruthy();
	});

	it('renders management details correctly', () => {
		const { getByText } = render(<TraineeOrg profile={profile}  bgColor={bgColor} textColor={textColor} />);

		expect(getByText('MANAGEMENT')).toBeTruthy();
		expect(getByText('Program:')).toBeTruthy();
		expect(getByText('Software Engineering')).toBeTruthy();
		expect(getByText('Cohort :')).toBeTruthy();
		expect(getByText('Cohort 1')).toBeTruthy();
		expect(getByText('Team:')).toBeTruthy();
		expect(getByText('Team A')).toBeTruthy();
		expect(getByText('Phase:')).toBeTruthy();
		expect(getByText('Phase 1')).toBeTruthy();
	});
	it('renders unavailable text when data is missing', () => {
		const emptyProfile = {};
		const { getAllByText } = render(
		  <TraineeOrg 
			profile={emptyProfile}
			bgColor="bg-white" 
			textColor="text-black" 
		  />
		);
	
		const unavailableElements = getAllByText('Unavailable');
		expect(unavailableElements.length).toBe(6); // Adjust the expected count to match the actual rendered elements
	  });
});