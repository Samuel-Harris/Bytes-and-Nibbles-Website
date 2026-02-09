import React from "react";
import { SectionSchema } from "@bytes-and-nibbles/shared";
import Paragraph from "./Paragraph";
import CaptionedImage from "./CaptionedImage";

import Subsection from "./Subsection";

const Section: React.FC<SectionSchema> = ({ title, body }: SectionSchema) => (
  <div className="my-8">
    <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">
      {title}
    </h2>
    <div className="space-y-4">
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
              <Paragraph
                value={bodyComponent.value}
                key={bodyComponent.value}
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
        }
      })}
    </div>
  </div>
);
export default Section;
