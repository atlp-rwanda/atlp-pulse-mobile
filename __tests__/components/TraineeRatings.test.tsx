import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TraineeRatings from '../../components/sprintRatings';
import { TRAINEE_RATING } from '../../graphql/mutations/ratings';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('@expo/vector-icons/AntDesign', () => 'AntDesign');
jest.mock('@expo/vector-icons/EvilIcons', () => 'EvilIcons');
jest.mock('@expo/vector-icons/Fontisto', () => 'Fontisto');

const mockRatingsData = {
  request: {
    query: TRAINEE_RATING,
    context: {
      headers: {
        Authorization: 'Bearer mockToken',
      },
    },
  },
  result: {
    data: {
      fetchRatingsTrainee: [
        {
          sprint: 1,
          quantity: 5,
          quality: 4,
          professional_Skills: 'Good',
          feedbacks: [{ sender: { role: 'Manager' }, content: 'Great performance' }],
        },
      ],
    },
  },
};

describe('TraineeRatings Component', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mockToken');
  });
  it('fetches user token from AsyncStorage', async () => {
    const mockToken = 'mock-token';
    AsyncStorage.getItem = jest.fn(() => Promise.resolve(mockToken));
  
    render(<TraineeRatings />);
  
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('authToken');
    });
  });
  
  it('alerts when token is not found', async () => {
    AsyncStorage.getItem = jest.fn(() => Promise.resolve(null));
    global.alert = jest.fn();
  
    render(<TraineeRatings />);
  
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error', 'User token not found.');
    });
  });
  it('displays error message when there is a query error', async () => {
    const mockError = new Error('Error loading ratings');
    const mockErrorQuery = {
      request: { query: TRAINEE_RATING },
      error: mockError,
    };
  
    const { getByText } = render(
      <MockedProvider mocks={[mockErrorQuery]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    await waitFor(() => {
      expect(getByText('Error')).toBeTruthy();
    });
  });
  it('filters ratings by sprint', async () => {
    const { getByPlaceholderText, getAllByText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    fireEvent.changeText(getByPlaceholderText('Filter by Sprint'), '2');
    
    await waitFor(() => {
      const sprintFiltered = getAllByText(/Sprint 2/i);
      expect(sprintFiltered.length).toBeGreaterThan(0);
    });
  });
  it('changes phase selection and filters data', async () => {
    const { getByText, getAllByText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    fireEvent.press(getByText('Phase II'));
  
    await waitFor(() => {
      const phaseFiltered = getAllByText('Phase II');
      expect(phaseFiltered.length).toBeGreaterThan(0);
    });
  });
  it('renders fetched data in table rows', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    await waitFor(() => {
      expect(getByText('SPRINT')).toBeTruthy();
      expect(getByText('QUANTITY')).toBeTruthy();
    });
  });
  it('displays no ratings message when there is no data', async () => {
    const emptyMockData = {
      request: { query: TRAINEE_RATING },
      result: { data: { fetchRatingsTrainee: [] } },
    };
  
    const { getByText } = render(
      <MockedProvider mocks={[emptyMockData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    await waitFor(() => {
      expect(getByText('No Ratings Available')).toBeTruthy();
    });
  });
  it('displays feedback modal with correct content when view button is pressed', async () => {
    const { getByText, getAllByText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    const viewButtons = getAllByText('View');
    fireEvent.press(viewButtons[0]);
  
    await waitFor(() => {
      expect(getByText('From: Manager')).toBeTruthy();
      expect(getByText('Feedback: Great performance')).toBeTruthy();
    });
  });
  
  it('renders without errors and displays fetched data', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );

    expect(getByText('Recent feedback')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('1')).toBeTruthy(); // Sprint 1
      expect(getByText('5')).toBeTruthy(); // Quantity 5
      expect(getByText('Good')).toBeTruthy(); // Professional Skills
    });
    const filterInput = getByPlaceholderText('Filter by Sprint');
    fireEvent.changeText(filterInput, '1');
    expect(filterInput.props.value).toBe('1');
  });

  it('handles phase selection correctly', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );

    const phaseOne = getByText('Phase I');
    expect(phaseOne.props.style[0].fontWeight).toBe('bold');

    const phaseTwo = getByText('Phase II');
    fireEvent.press(phaseTwo);

    await waitFor(() => {
      expect(phaseTwo.props.style[0].fontWeight).toBe('bold');
    });
  });

  it('displays feedback modal when view button is pressed', async () => {
    const { findAllByText, getByText } = render(
      <MockedProvider mocks={[mockRatingsData]} addTypename={false}>
        <TraineeRatings />
      </MockedProvider>
    );
  
    const viewButtons = await findAllByText('View'); // Async await find method
    fireEvent.press(viewButtons[0]);
  
    await waitFor(() => {
      expect(getByText('From: Manager')).toBeTruthy();
      expect(getByText('Feedback: Great performance')).toBeTruthy();
    });
  });
  
});
