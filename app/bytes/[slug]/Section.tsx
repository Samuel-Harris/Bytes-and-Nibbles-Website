import React from "react";
import { theme } from "@/app/utils/theme";
import { SectionType } from "@/app/utils/Byte";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";

const Section: React.FC<SectionType> = (props: SectionType) => (
  <div className={`${theme.sectionMargin}`}>
    <p
      className={`${theme.tertiaryColourText} ${theme.subheadingStyle} ${theme.subheadingMargin}`}
    >
      {props.title}
    </p>
    {React.Children.toArray(
      props.body.map((bodyComponent) => {
        switch (bodyComponent.type) {
          case "paragraph":
            return Paragraph(bodyComponent);
          case "captionedImage":
            return CaptionedImage(bodyComponent);
        }
      })
    )}
  </div>
);
export default Section;
