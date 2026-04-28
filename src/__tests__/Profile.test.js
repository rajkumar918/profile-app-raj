import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../pages/Profile';
import { BrowserRouter } from 'react-router-dom';

// Minimal smoke test to ensure profile renders navigation
test('renders Profile navigation buttons', () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );

  expect(screen.getByText(/Summary/i)).toBeInTheDocument();
  expect(screen.getByText(/Skills/i)).toBeInTheDocument();
  expect(screen.getByText(/Contact/i)).toBeInTheDocument();
});
