import React from "react";
import {
  SectionSchema,
  getLatexText,
  getParagraphText,
} from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import Subsection from "./Subsection";
import Collapsible from "./Collapsible";
import LatexParagraph from "./LatexParagraph";
import CollapsibleGroup from "./CollapsibleGroup";

const Section: React.FC<SectionSchema> = ({
  title,
  body,
  isCollapsible,
}: SectionSchema) => (
  <Collapsible
    title={title}
    isCollapsible={isCollapsible}
    titleClassName={`text-2xl mb-2 ${TERTIARY_COLOUR_TEXT}`}
    className="my-4"
  >
    {body.map((bodyComponent, index) => {
      switch (bodyComponent.type) {
        case "subsection":
          return (
            <Subsection
              title={bodyComponent.value.title}
              body={bodyComponent.value.body}
              isCollapsible={bodyComponent.value.isCollapsible}
              key={bodyComponent.value.title}
            />
          );
        case "paragraph":
          return (
            <Paragraph
              value={getParagraphText(bodyComponent.value)}
              key={`paragraph-${index}`}
            />
          );
        case "captionedImage":
          return (
            <CaptionedImage
              image={bodyComponent.value.image}
              caption={bodyComponent.value.caption}
              key={bodyComponent.value.caption}
            />
          );
        case "latexParagraph":
          return (
            <LatexParagraph
              value={getLatexText(bodyComponent.value)}
              key={`${bodyComponent.type}-${index}`}
            />
          );
        case "collapsibleGroup":
          return (
            <CollapsibleGroup
              title={bodyComponent.value.title}
              body={bodyComponent.value.body}
              key={`${bodyComponent.type}-${index}`}
            />
          );
      }
    })}
  </Collapsible>
);
export default Section;
