import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './auth/Login';




test('renders welcome message', () => {
  render(<Login />);
  const welcomeElement = screen.getByText(/Login/i);
  expect(welcomeElement).toBeInTheDocument();
});
