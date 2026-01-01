import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('Root layout', () => {
  it('renders children', () => {
    render(<RootLayout><div>Test Child</div></RootLayout>);
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
