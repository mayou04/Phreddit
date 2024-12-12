import { render, screen, waitFor } from '@testing-library/react';
import Header from './components/header.js'; // Adjust the path as needed
import * as utils from './utility.js';

jest.mock('./utility.js', () => ({
    status: jest.fn(),
    logoutUser: jest.fn(),
    getSearchResults: jest.fn(),
    requestData: jest.fn(),
}));

describe('Create Post Button Behavior', () => {
    test("'Create Post' button is disabled for guest users (logged out)", async () => {
        utils.status.mockResolvedValue({
            isLoggedIn: false,
            user: null,
        });

        render(<Header />);
        await waitFor(() => expect(screen.getByText('Guest')).toBeInTheDocument());
        const createPostButton = screen.getByValue('Create Post');
        expect(createPostButton).toBeDisabled();
    });

    test("'Create Post' button is enabled for logged-in users", async () => {
        utils.status.mockResolvedValue({
            isLoggedIn: true,
            user: { name: 'tester' },
        });

        render(<Header />);
        await waitFor(() => expect(screen.getByText('tester')).toBeInTheDocument());
        const createPostButton = screen.getByValue('Create Post');
        expect(createPostButton).toBeEnabled();
    });
});
