import React from "react";
import { SectionType } from "@/common/Byte";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";

const Section: React.FC<SectionType> = (props: SectionType) => (
  <div className="my-4">
    <p className={`text-2xl font-underline mb-2 ${TERTIARY_COLOUR_TEXT}`}>
      {props.title}
    </p>
    {React.Children.toArray(
      props.body.map((bodyComponent) => {
        switch (bodyComponent.type) {
          case "paragraph":
            return <Paragraph value={bodyComponent.value} />;
          case "captionedImage":
            return (
              <CaptionedImage
                image={bodyComponent.value.image}
                caption={bodyComponent.value.caption}
              />
            );
        }
      })
    )}
  </div>
);
export default Section;
