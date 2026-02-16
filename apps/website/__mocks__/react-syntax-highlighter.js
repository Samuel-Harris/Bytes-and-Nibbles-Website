const React = require("react");

const SyntaxHighlighter = ({ children }) =>
  React.createElement("pre", null, React.createElement("code", null, children));

module.exports = {
  Prism: SyntaxHighlighter,
  Light: SyntaxHighlighter,
  default: SyntaxHighlighter,
};
