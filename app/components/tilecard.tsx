import { FC } from "react";
import { style } from "../utils/websiteConstants";
import { getDate as convertDateToString } from "../utils/timeUtils";

interface TilecardProps {
    title: string;
    subtitle: string;
    thumbnail: string;
    publishDate: Date;
}

const Tilecard: FC<TilecardProps> = (props: TilecardProps) => {
    const textStyle = "pl-5 row-span-1 col-span-3";

    return (
        <div className={`grid grid-rows-3 grid-cols-4 justify-items-left items-center px-3 py-2 hover:${style.hoverColour}`}>
            <div className="row-span-3 col-span-1 w-full h-full bg-pink-900" />
            <p className={`text-3xl ${textStyle} ${style.accentColour}`}>{props.title}</p>
            <p className={`text-xl ${textStyle} ${style.textColour}`}>{props.subtitle}</p>
            <p className={`text-s ${textStyle} ${style.textColour}`}>{convertDateToString(props.publishDate)}</p>
        </div>
    );
}

export default Tilecard;
