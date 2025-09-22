import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './src/App.jsx';  // adjust import path if needed

describe('App component', () => {
  test('renders learn react text', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});
