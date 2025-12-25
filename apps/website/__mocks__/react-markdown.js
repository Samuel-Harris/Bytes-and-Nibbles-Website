import React from "react";

/* eslint-disable react/prop-types */
const ReactMarkdown = ({
  children,
  remarkPlugins: _remarkPlugins,
  rehypePlugins: _rehypePlugins,
  ...otherProps
}) => {
  // Filter out ReactMarkdown-specific props that shouldn't go to DOM
  return React.createElement(
    "div",
    {
      "data-testid": "react-markdown",
      ...otherProps,
    },
    children
  );
};

module.exports = ReactMarkdown;
