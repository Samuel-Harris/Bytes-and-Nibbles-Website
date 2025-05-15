import React from "react";
import { SectionType } from "@/common/Byte";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import { theme } from "@/common/theme";
import Subsection from "./Subsection";

const Section: React.FC<SectionType> = ({ title, body }: SectionType) => (
  <div className="my-4">
    <p className={`text-2xl mb-2 ${theme.colours.tertiary.text}`}>{title}</p>
    {body.map((bodyComponent) => {
      switch (bodyComponent.type) {
        case "subsection":
          return (
            <Subsection
              title={bodyComponent.value.title}
              body={bodyComponent.value.body}
              key={bodyComponent.value.title}
            />
          );
        case "paragraph":
          return (
            <Paragraph value={bodyComponent.value} key={bodyComponent.value} />
          );
        case "captionedImage":
          return (
            <CaptionedImage
              image={bodyComponent.value.image}
              caption={bodyComponent.value.caption}
              key={bodyComponent.value.caption}
            />
          );
      }
    })}
  </div>
);
export default Section;
