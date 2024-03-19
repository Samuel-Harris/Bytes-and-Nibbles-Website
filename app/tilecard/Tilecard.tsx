import React from "react";
import { FC } from "react";
import theme, { TILECARD_TEXT_PADDING } from "../common/theme";
import { getDateString } from "../common/timeUtils";
import Link from "next/link";

export type TilecardProps = {
  children: React.ReactNode;
  title: string;
  thumbnail: string;
  publishDate: Date;
  linkPath: string;
};

const Tilecard: FC<TilecardProps> = ({
  children,
  title,
  thumbnail,
  publishDate,
  linkPath,
}: TilecardProps) => (
  <Link
    href={linkPath}
    title={title}
    className={`grid grid-cols-4 justify-items-left w-11/12 sm:w-4/5 py-6 sm:py-7 md:py-12 px-5 my-0 sm:my-4 md:my-7 ${theme.hoverColour}`}
  >
    <img src={thumbnail} alt={title} />
    <div className="col-span-3">
      <p
        className={`text-2xl sm:text-3xl md:text-5xl sm:mb-1 md:mb-3 ${TILECARD_TEXT_PADDING} ${theme.secondaryColourText}`}
      >
        {title}
      </p>
      {children}
      <p className={`text-sm md:text-base text-white ${TILECARD_TEXT_PADDING}`}>
        {getDateString(publishDate)}
      </p>
    </div>
  </Link>
);

export default Tilecard;
