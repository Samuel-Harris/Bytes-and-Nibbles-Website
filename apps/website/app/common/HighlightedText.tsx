import React from "react";
import { SECONDARY_COLOUR_TEXT } from "./theme";

const HighlightedText: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <span className={SECONDARY_COLOUR_TEXT}>{children}</span>;
export default HighlightedText;
