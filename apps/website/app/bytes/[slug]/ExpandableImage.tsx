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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-between p-2 md:p-4 animate-in fade-in zoom-in duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 w-full h-full flex items-center justify-center min-h-0 overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center rounded-lg shadow-2xl overflow-hidden">
                {children}
              </div>
            </div>

            {caption && (
              <div
                className={`flex-none mt-2 max-w-2xl px-6 py-2 text-center ${TERTIARY_COLOUR_TEXT} animate-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both bg-black/60 backdrop-blur-md rounded-xl text-sm md:text-base`}
              >
                <ReactMarkdown remarkPlugins={[gfm]}>{caption}</ReactMarkdown>
              </div>
            )}
          </div>

          <button
            className="absolute top-6 right-6 z-[60] text-white/70 hover:text-white transition-all p-2 rounded-full hover:bg-white/10 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            aria-label="Close"
          >
            <XMarkIcon className="w-10 h-10" />
          </button>
        </div>
      )}
    </>
  );
};

export default ExpandableImage;
