import React from "react";

interface LogoIconProps {
  className?: string;
}

export default function logoIcon(props: LogoIconProps): JSX.Element {
  return (
    <svg
      fill="none"
      viewBox="0 0 32.96244 20.937038"
      strokeWidth="1.5"
      stroke="currentColor"
      data-slot="icon"
      className={props.className}
      version="1.1"
      id="svg1"
      width="32.96244"
      height="20.937038"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs id="defs1" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 13.663425,14.273604 h 0.01 m 2.99,-5.0000003 h 0.01 m -5.01,-1 h 0.01 m 7.99,6.0000003 h 0.01 m 5.99,-4 c 0,4.9706 -4.0294,9 -9,9 -4.97056,0 -8.9999999,-4.0294 -8.9999999,-9 0,-4.9705603 4.0294399,-9.0000002 8.9999999,-9.0000002 0,2.76142 1.7909,4.9999999 4,4.9999999 0,2.2091 2.2386,4.0000003 5,4.0000003 z"
        id="path1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m 24.278514,0.88665998 7.797293,9.58185902 -7.797293,9.581859 m -15.5945879,0 L 0.88663434,10.468519 8.6839261,0.88665998"
        id="path1-9"
      />
    </svg>
  );
}
