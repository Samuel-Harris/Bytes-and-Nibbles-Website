import React from "react";
import Link from "next/link";
import { theme } from "../common/theme";
import { getDateString } from "../common/timeUtils";

export interface TilecardProps {
  /** Content to be rendered inside the card */
  children: React.ReactNode;
  /** Title of the card */
  title: string;
  /** URL of the thumbnail image */
  thumbnail: string;
  /** Publication date */
  publishDate: Date;
  /** Link path for navigation */
  linkPath: string;
  /** Additional CSS classes (optional) */
  className?: string;
}

/**
 * TileCard component displays content in a card format with title, thumbnail and date
 * Used for displaying both Bytes and Nibbles items
 */
const Tilecard: React.FC<TilecardProps> = ({
  children,
  title,
  thumbnail,
  publishDate,
  linkPath,
  className = "",
}) => {
  const baseClassName: string = `grid grid-cols-4 justify-items-left w-11/12 sm:w-4/5 py-6 sm:py-7 md:py-12 px-5 my-0 sm:my-4 md:my-7 no-underline ${theme.colours.hover.bg}`;
  const titleClassName: string = `text-2xl sm:text-3xl md:text-5xl sm:mb-1 md:mb-3 ${theme.layout.tilecard.textPadding} ${theme.colours.secondary.text}`;
  const dateClassName: string = `text-sm md:text-base text-white ${theme.layout.tilecard.textPadding}`;

  return (
    <Link
      href={linkPath}
      title={title}
      className={`${baseClassName} ${className}`}
    >
      <img src={thumbnail} alt={title} />
      <div className="col-span-3">
        <p className={titleClassName}>{title}</p>
        {children}
        <p className={dateClassName}>{getDateString(publishDate)}</p>
      </div>
    </Link>
  );
};

export default Tilecard;
