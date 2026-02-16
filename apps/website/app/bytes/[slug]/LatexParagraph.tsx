"use client";

import React from "react";
import { LatexRenderer } from "@bytes-and-nibbles/shared";

export type LatexParagraphProps = {
  value: string;
};

const LatexParagraph: React.FC<LatexParagraphProps> = ({
  value,
}: LatexParagraphProps) => (
  <div className="mb-8">
    <LatexRenderer value={value} />
  </div>
);
export default LatexParagraph;
