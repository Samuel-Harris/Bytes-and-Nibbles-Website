import { theme } from "@/common/theme";
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
    <ReactMarkdown
      className={theme.colours.tertiary.text}
      remarkPlugins={[gfm]}
    >
      {caption}
    </ReactMarkdown>
  </div>
);
export default CaptionedImage;
