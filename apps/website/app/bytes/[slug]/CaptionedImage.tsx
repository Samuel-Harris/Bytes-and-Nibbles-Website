import { TERTIARY_COLOUR_TEXT } from "@/common/theme";
import React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export type CaptionedImageProps = {
  image: string;
  caption: string;
};

const CaptionedImage: React.FC<CaptionedImageProps> = ({
  image,
  caption,
}: CaptionedImageProps) => (
  <div className="my-7">
    <img src={image} alt={caption} className={`justify-self-center w-fit`} />
    <div className={TERTIARY_COLOUR_TEXT}>
      <ReactMarkdown remarkPlugins={[gfm]}>
        {caption}
      </ReactMarkdown>
    </div>
  </div>
);
export default CaptionedImage;
