import React from "react";
import {
  SubsectionBodyElementSchema,
  SubsubsectionBodyElementSchema,
} from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import LatexParagraph from "./LatexParagraph";
import CollapsibleGroup from "./CollapsibleGroup";
import Collapsible from "./Collapsible";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";

type BodyElementSchema =
  | SubsectionBodyElementSchema
  | SubsubsectionBodyElementSchema;

const Body: React.FC<{ body: BodyElementSchema[] }> = ({
  body,
}: {
  body: BodyElementSchema[];
}) =>
  body.map((bodyElement: BodyElementSchema, index: number) => {
    switch (bodyElement.type) {
      case "subsubsection":
        return (
          <Collapsible
            title={bodyElement.value.title}
            isCollapsible={bodyElement.value.isCollapsible}
            titleClassName={`text-lg mb-2 ${TERTIARY_COLOUR_TEXT}`}
            className="my-3"
            key={`${bodyElement.type}-${index}`}
          >
            <Body body={bodyElement.value.body} />
          </Collapsible>
        );
      case "paragraph":
        return (
          <Paragraph
            value={bodyElement.value}
            key={`${bodyElement.type}-${index}`}
          />
        );
      case "captionedImage":
        return (
          <CaptionedImage
            image={bodyElement.value.image}
            caption={bodyElement.value.caption}
            key={`${bodyElement.type}-${index}`}
          />
        );
      case "latexParagraph":
        return (
          <LatexParagraph
            value={bodyElement.value}
            key={`${bodyElement.type}-${index}`}
          />
        );
      case "collapsibleGroup":
        return (
          <CollapsibleGroup
            title={bodyElement.value.title}
            body={bodyElement.value.body}
            key={`${bodyElement.type}-${index}`}
          />
        );
    }
  });
export default Body;
