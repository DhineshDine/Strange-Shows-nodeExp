import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from './src/App.jsx';

describe('App component', () => {
  test('renders learn react text', () => {
    render(<App />);
    expect(screen.getByText(/learn react/i)).toBeDefined();
  });
});
