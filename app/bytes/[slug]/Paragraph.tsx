import React from "react";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = (props: ParagraphProps) => (
  <p className="text-lg">{props.value}</p>
);
export default Paragraph;
