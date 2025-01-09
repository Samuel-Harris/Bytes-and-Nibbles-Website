import React from "react";
import { SectionType } from "@/common/Byte";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import Subsection from "./Subsection";

const Section: React.FC<SectionType> = ({ title, body }: SectionType) => (
  <div className="my-4">
    <p className={`text-2xl mb-2 ${TERTIARY_COLOUR_TEXT}`}>{title}</p>
    {React.Children.toArray(
      body.map((bodyComponent) => {
        switch (bodyComponent.type) {
          case "subsection":
            return (<>
              <p>hello</p>
              <p>{bodyComponent.value.title}</p>
              <Subsection
                title={bodyComponent.value.title}
                body={bodyComponent.value.body}
              />
              </>
            );
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
