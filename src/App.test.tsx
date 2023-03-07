import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import App from './App';

describe('App component', () => {
    beforeEach(() => {
        // @ts-ignore
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        {
                            albumId: 1,
                            id: 1,
                            title: 'accusamus beatae ad facilis cum similique qui sunt',
                            url: 'https://via.placeholder.com/600/92c952',
                            thumbnailUrl: 'https://via.placeholder.com/150/92c952',
                        },
                        {
                            albumId: 1,
                            id: 2,
                            title: 'reprehenderit est deserunt velit ipsam',
                            url: 'https://via.placeholder.com/600/771796',
                            thumbnailUrl: 'https://via.placeholder.com/150/771796',
                        },
                    ]),
            })
        );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    beforeAll(() => {
        jest.spyOn(window, 'fetch');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the photos list', async () => {
        render(<App/>);
        const listItems = await screen.findAllByRole('listitem');
        expect(listItems).toHaveLength(2);
    });

    it('should request load more photos to API when the button is clicked', async () => {
        render(<App/>);
        expect(window.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/photos?_limit=6&_start=0');

        // Click the "Load More" button
        fireEvent.click(screen.getByText('Load More'));

        expect(window.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/photos?_limit=6&_start=6');
    });

    it('should open the selected photo in a modal', async () => {
        render(<App/>);
        const photo = await screen.findByAltText('accusamus beatae ad facilis cum similique qui sunt');
        fireEvent.click(photo);
        const modal = screen.getByTestId('1').closest('.modal');
        expect(modal).toBeInTheDocument();
    });

    it('should close the modal when the close button is clicked', async () => {
        render(<App/>);
        const photo = await screen.findByAltText('accusamus beatae ad facilis cum similique qui sunt');
        fireEvent.click(photo);
        const closeButton = screen.getByTestId('close-button-1');
        fireEvent.click(closeButton);
        const modal = photo.closest('.modal');
        expect(modal).not.toBeInTheDocument();
    });
});
