import React from "react";
import { theme } from "./theme";

const HighlightedText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <span className={theme.colours.secondary.text}>{children}</span>;
export default HighlightedText;
