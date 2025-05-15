import React from "react";

export type CookieIconProps = {
  className?: string;
};

const CookieIcon: React.FC<CookieIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    data-slot="icon"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 16H9.01M12 11H12.01M7 10H7.01M15 16H15.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C12 5.76142 13.7909 8 16 8C16 10.2091 18.2386 12 21 12Z"
    />
    <title>
      A cookie with a bite take out of it surrounded by angle brackets.
    </title>
  </svg>
);
export default CookieIcon;
