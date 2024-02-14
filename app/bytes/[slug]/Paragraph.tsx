import React from "react";
import { theme } from "@/app/utils/websiteConstants";
import { ParagraphType } from "@/app/utils/Byte";

type ParagraphProps = ParagraphType;

const Paragraph: React.FC<ParagraphProps> = (props: ParagraphProps) => (
  <p className={`${theme.paragraphStyle}`}>{props.value}</p>
);
export default Paragraph;
