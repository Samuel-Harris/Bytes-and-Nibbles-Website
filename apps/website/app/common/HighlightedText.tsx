import React from "react";

const HighlightedText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  // Using a span instead of Badge to avoid pill styling, but keeping the primary color
  // and font weight to make it "highlighted"
  <span className="font-bold text-primary">{children}</span>
);
export default HighlightedText;
