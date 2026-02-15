import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import SvgFitter from "./SvgFitter";
import ExpandableImage from "./ExpandableImage";

export type CaptionedImageProps = {
  image: string;
  caption: string;
};

const CaptionedImage = async ({ image, caption }: CaptionedImageProps) => {
  let svgContent: string | null = null;

  if (image.includes(".svg")) {
    try {
      const response = await fetch(image);
      if (response.ok) {
        svgContent = await response.text();
      }
    } catch (e) {
      console.error("Failed to fetch SVG:", e);
    }
  }

  return (
    <div className="my-7 flex flex-col items-center">
      <ExpandableImage caption={caption}>
        {svgContent ? (
          <SvgFitter
            content={svgContent}
            className="w-full max-w-full overflow-visible"
          />
        ) : (
          <img
            src={image}
            alt={caption}
            className={`justify-self-center w-full h-auto`}
          />
        )}
      </ExpandableImage>
      <div className={`${TERTIARY_COLOUR_TEXT} mt-2`}>
        <ReactMarkdown remarkPlugins={[gfm]}>{caption}</ReactMarkdown>
      </div>
    </div>
  );
};
export default CaptionedImage;
