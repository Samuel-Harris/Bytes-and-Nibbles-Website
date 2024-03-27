import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type ParagraphProps = {
  value: string;
};

const Paragraph: React.FC<ParagraphProps> = (props: ParagraphProps) => (
  <ReactMarkdown remarkPlugins={[gfm]}>{props.value}</ReactMarkdown>
);
export default Paragraph;
