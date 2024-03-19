import React from "react";
import { FC } from "react";
import theme from "../common/theme";
import { getDateString } from "../common/timeUtils";
import Link from "next/link";
import { Series } from "@/common/Byte";

export type TilecardProps = {
  title: string;
  subtitle: string | undefined;
  series: Series | undefined;
  timeTakenMinutes: number | undefined;
  thumbnail: string;
  publishDate: Date;
  linkPath: string;
};

const Tilecard: FC<TilecardProps> = ({
  title,
  subtitle,
  series,
  timeTakenMinutes,
  thumbnail,
  publishDate,
  linkPath,
}: TilecardProps) => {
  const textStyle = "pl-5";

  return (
    <Link
      href={linkPath}
      title={title}
      className={`grid grid-cols-4 justify-items-left w-11/12 sm:w-4/5 py-6 sm:py-7 md:py-12 px-5 my-0 sm:my-4 md:my-7 ${theme.hoverColour}`}
    >
      <img src={thumbnail} alt={title} />
      <div className="col-span-3">
        <p
          className={`text-2xl sm:text-3xl md:text-5xl sm:mb-1 md:mb-3 ${textStyle} ${theme.secondaryColourText}`}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 ${textStyle} ${theme.tertiaryColourText}`}
          >
            {subtitle}
          </p>
        )}
        {series && (
          <p
            style={{ backgroundColor: series.accentColour }} // cannot be set in tailwind as this is dynamically generated
            className={`text-sm md:text-base inline-flex rounded-full mx-3 px-2 py-1 sm:mb-2 md:mb-3 font-medium ring-1 ring-inset ring-slate-500`}
          >
            {series.title}
          </p>
        )}
        {timeTakenMinutes && (
          <p
            className={`text-lg sm:text-xl md:text-3xl sm:mb-2 md:mb-3 ${textStyle} ${theme.tertiaryColourText}`}
          >
            {timeTakenMinutes} minutes
          </p>
        )}
        <p className={`text-sm md:text-base text-white ${textStyle}`}>
          {getDateString(publishDate)}
        </p>
      </div>
    </Link>
  );
};

export default Tilecard;
