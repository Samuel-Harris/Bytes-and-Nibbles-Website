import React from "react";
import { FC } from "react";
import { style } from "../utils/websiteConstants";
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
    <Link href={props.linkPath}>
      <div
        className={`grid grid-cols-4 justify-items-left px-5 py-4 ${style.hoverColour}`}
      >
        <img src={props.thumbnail} alt={props.title} />
        <div className="col-span-3">
          <p
            className={`text-2xl sm:text-3xl md:text-5xl sm:pb-2 md:pb-3 ${textStyle} ${style.accentColour}`}
          >
            {props.title}
          </p>
          <p
            className={`text-lg sm:text-xl md:text-3xl sm:pb-2 md:pb-3 ${textStyle} ${style.textColour}`}
          >
            {props.subtitle}
          </p>
          <p
            className={`text-sm md:text-base ${textStyle} ${style.textColour}`}
          >
            {getDateString(props.publishDate)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Tilecard;
