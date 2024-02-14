import React from "react";
import { theme } from "@/app/utils/theme";
import { ParagraphType } from "@/app/utils/Byte";

const Paragraph: React.FC<ParagraphType> = (props: ParagraphType) => (
  <p className={`${theme.paragraphStyle}`}>{props.value}</p>
);
export default Paragraph;
