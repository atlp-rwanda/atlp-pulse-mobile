import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Resume from '@/components/Resume';
import { MockedProvider } from '@apollo/client/testing';
import { UPLOAD_RESUME } from '@/graphql/mutations/Resume.mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';

jest.mock('react-native-toast-notifications', () => ({
    useToast: jest.fn(),
}));

jest.mock('expo-document-picker', () => ({
    getDocumentAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

const mocks = [
    {
        request: {
            query: UPLOAD_RESUME,
            variables: {
                userId: 'testUserId',
                resume: 'testResumeUrl',
            },
        },
        result: {
            data: {
                uploadResume: {
                    success: true,
                    message: 'Resume uploaded successfully',
                },
            },
        },
    },
];

describe('Resume Component', () => {
    const toast = {
        show: jest.fn(),
    };

    beforeEach(() => {
        (useToast as jest.Mock).mockReturnValue(toast);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('testToken');
    });

    it('renders correctly', () => {
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Resume />
            </MockedProvider>
        );
        expect(getByText('Upload from your pc')).toBeTruthy();
        expect(getByText('Add external link')).toBeTruthy();
    });

    it('handles file upload correctly', async () => {
        const { getByText, getByPlaceholderText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Resume />
            </MockedProvider>
        );

        fireEvent.press(getByText('Upload from your pc'));
        fireEvent.press(getByText('Choose File'));

        await waitFor(() => {
            expect(toast.show).toHaveBeenCalledWith('Token Not found.', { type: 'danger', placement: 'top', duration: 3000 });
        });
    });

    it('handles external link upload correctly', async () => {
        const { getByText, getByPlaceholderText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Resume />
            </MockedProvider>
        );

        fireEvent.press(getByText('Add external link'));
        fireEvent.changeText(getByPlaceholderText('Enter external link'), 'http://example.com/resume.pdf');
        fireEvent.press(getByText('Upload'));

        await waitFor(() => {
            expect(toast.show).toHaveBeenCalledWith('Resume uploaded successfully', { type: 'success', placement: 'top', duration: 3000 });
        });
    });

    it('shows error when external link is empty', async () => {
        const { getByText } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Resume />
            </MockedProvider>
        );

        fireEvent.press(getByText('Add external link'));
        fireEvent.press(getByText('Upload'));

        await waitFor(() => {
            expect(toast.show).toHaveBeenCalledWith('Please enter a valid external link', { type: 'danger', placement: 'top', duration: 3000 });
        });
    });
});