import React from "react";
import { SubsectionSchema } from "@bytes-and-nibbles/shared";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import Body from "./Body";
import Collapsible from "./Collapsible";

const Subsection: React.FC<SubsectionSchema> = ({
  title,
  body,
  isCollapsible,
}: SubsectionSchema) => (
  <Collapsible
    title={title}
    isCollapsible={isCollapsible}
    titleClassName={`text-xl mb-2 ${TERTIARY_COLOUR_TEXT}`}
    className="my-4"
  >
    <Body body={body} />
  </Collapsible>
);
export default Subsection;
