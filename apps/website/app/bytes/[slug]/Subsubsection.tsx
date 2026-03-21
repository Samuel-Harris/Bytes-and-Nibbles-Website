import React from "react";
import { SubsubsectionSchema } from "@bytes-and-nibbles/shared";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import LeafBody from "./LeafBody";
import Collapsible from "./Collapsible";

const Subsubsection: React.FC<SubsubsectionSchema> = ({
  title,
  body,
  isCollapsible,
}: SubsubsectionSchema) => (
  <Collapsible
    title={title}
    isCollapsible={isCollapsible}
    titleClassName={`text-lg mb-2 ${TERTIARY_COLOUR_TEXT}`}
    className="my-4"
  >
    <LeafBody body={body} />
  </Collapsible>
);
export default Subsubsection;
