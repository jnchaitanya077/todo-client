import { render, screen } from '@testing-library/react';
import AppRouter from './App';

test('renders learn react link', async () => {
    render(<AppRouter />);
    const linkElement = await screen.findAllByText(/Login/i);
    console.log(linkElement);
    // expect(linkElement).;
});

test('renders learn react link', async () => {
    render(<AppRouter />);
    const linkElement = await screen.findAllByText(/Login/i);
});
