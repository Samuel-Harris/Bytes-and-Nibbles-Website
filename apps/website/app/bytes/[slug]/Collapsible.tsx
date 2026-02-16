"use client";

import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";

type CollapsibleProps = {
  title: string;
  isCollapsible?: boolean;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
};

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  isCollapsible = false,
  children,
  className = "",
  titleClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(!isCollapsible);

  if (!isCollapsible) {
    return (
      <div className={className}>
        <p className={titleClassName}>{title}</p>
        {children}
      </div>
    );
  }

  return (
    <div className={`my-4 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full text-left focus:outline-none group"
      >
        <div
          className={`mr-2 flex-shrink-0 ${TERTIARY_COLOUR_TEXT} group-hover:text-green-500`}
        >
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </div>
        <p className={`${titleClassName} !m-0`}>{title}</p>
      </button>
      {isOpen && <div className="mt-2 ml-7">{children}</div>}
    </div>
  );
};

export default Collapsible;
