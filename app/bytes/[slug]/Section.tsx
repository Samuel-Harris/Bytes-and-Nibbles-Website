import React from "react";
import { theme } from "@/app/utils/websiteConstants";
import { SectionType } from "@/app/utils/Byte";
import Paragraph from "./Paragraph";

export type SectionProps = SectionType;

const Section: React.FC<SectionProps> = (props: SectionProps) => (
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
        }
      })
    )}
  </div>
);
export default Section;
