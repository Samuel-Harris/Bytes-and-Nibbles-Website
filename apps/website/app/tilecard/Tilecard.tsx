import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    className="no-underline w-11/12 sm:w-4/5 my-4 block h-64"
  >
    <Card className="hover:bg-accent hover:text-accent-foreground transition-colors border-none h-full flex flex-row overflow-hidden p-0">
      <div className="w-1/4 sm:w-1/5 h-full p-3 flex items-center justify-center">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="w-3/4 sm:w-4/5 flex flex-col p-4 sm:p-5">
        <CardHeader className="p-0 mb-2 space-y-0">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl text-primary font-bold break-normal line-clamp-2 leading-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-foreground text-sm sm:text-base line-clamp-3 mb-2">
          {children}
        </CardContent>
        <CardFooter className="p-0 mt-auto">
          <p className="text-xs sm:text-sm text-muted-foreground w-full text-right">
            {getDateString(publishDate)}
          </p>
        </CardFooter>
      </div>
    </Card>
  </Link>
);

export default Tilecard;
