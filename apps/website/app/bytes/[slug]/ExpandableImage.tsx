"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { TERTIARY_COLOUR_TEXT } from "@/common/theme";

interface ExpandableImageProps {
  children: React.ReactNode;
  caption: string;
}

const ExpandableImage = ({ children, caption }: ExpandableImageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExpanded]);

  return (
    <>
      <div
        className="cursor-zoom-in w-full transition-transform hover:scale-[1.01] active:scale-100"
        onClick={() => setIsExpanded(true)}
      >
        {children}
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out p-4 md:p-10"
          onClick={() => setIsExpanded(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            aria-label="Close"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          <div
            className="relative flex flex-col items-center max-w-full max-h-full animate-in fade-in zoom-in duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center max-w-full overflow-hidden rounded-lg shadow-2xl">
              {children}
            </div>

            <div
              className={`mt-6 max-w-2xl px-4 text-center ${TERTIARY_COLOUR_TEXT} animate-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both`}
            >
              <ReactMarkdown remarkPlugins={[gfm]}>{caption}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpandableImage;
