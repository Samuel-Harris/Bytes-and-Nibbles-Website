import React from 'react';
import { render, within } from '@testing-library/react';
import RootLayout from './layout';

describe('Root layout', () => {
  it('renders children', () => {
    // Mock console.error to ignore the known validateDOMNesting warning that occurs
    // when rendering a full <html> document inside the test environment.
    const originalConsoleError = console.error;
    console.error = jest.fn((...args) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      if (message.includes('validateDOMNesting')) {
        return;
      }
      originalConsoleError(...args);
    });

    const { container } = render(<RootLayout><div>Test Child</div></RootLayout>);

    // JSDOM will correct the invalid nesting (<html> inside <div>).
    // The content of the body will be rendered, so we can query the container.
    expect(within(container).getByText('Test Child')).toBeInTheDocument();

    // Restore the original console.error function
    console.error = originalConsoleError;
  });
});
