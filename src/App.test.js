import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SpecBud title', () => {
  render(<App />);
  const linkElement = screen.getByText(/SpecBud/i);
  expect(linkElement).toBeInTheDocument();
});
