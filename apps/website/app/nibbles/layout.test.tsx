import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './layout';

describe('Nibbles layout', () => {
  it('renders children', () => {
    render(<Layout><div>Test Child</div></Layout>);
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
