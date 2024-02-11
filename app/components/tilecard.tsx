import React from "react";
import { FC } from "react";
import { theme } from "../utils/websiteConstants";
import { getDateString } from "../utils/timeUtils";
import Link from "next/link";

export interface TilecardProps {
  title: string;
  subtitle: string;
  thumbnail: string;
  publishDate: Date;
  linkPath: string;
}

const Tilecard: FC<TilecardProps> = (props: TilecardProps) => {
  const textStyle = "pl-5";

  return (
    <Link
      href={props.linkPath}
      title={props.title}
      className={`grid grid-cols-4 justify-items-left w-11/12 sm:w-4/5 py-6 sm:py-7 md:py-12 px-5 my-0 sm:my-4 md:my-7 ${theme.hoverColour}`}
    >
      <img src={props.thumbnail} alt={props.title} />
      <div className="col-span-3">
        <p
          className={`text-2xl sm:text-3xl md:text-5xl sm:pb-2 md:pb-3 ${textStyle} ${theme.secondaryColourText}`}
        >
          {props.title}
        </p>
        <p
          className={`text-lg sm:text-xl md:text-3xl sm:pb-2 md:pb-3 ${textStyle} ${theme.tertiaryColourText}`}
        >
          {props.subtitle}
        </p>
        <p
          className={`text-sm md:text-base ${textStyle} ${theme.tertiaryColourText}`}
        >
          {getDateString(props.publishDate)}
        </p>
      </div>
    </Link>
  );
};

export default Tilecard;
