import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('renders the main headings', () => {
    render(<Home />);
    expect(screen.getByText('What is this?')).toBeInTheDocument();
    expect(screen.getByText('Who am I?')).toBeInTheDocument();
  });
});
