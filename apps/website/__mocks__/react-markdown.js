const React = require('react');

const ReactMarkdown = ({ children, remarkPlugins, rehypePlugins, ...otherProps }) => {
  // Filter out ReactMarkdown-specific props that shouldn't go to DOM
  return React.createElement('div', {
    'data-testid': 'react-markdown',
    ...otherProps
  }, children);
};

module.exports = ReactMarkdown;
