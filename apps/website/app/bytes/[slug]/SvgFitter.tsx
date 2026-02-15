"use client";

import React, { useEffect, useRef } from "react";

export default function SvgFitter({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        // Force width 100% and remove fixed height
        svg.setAttribute("width", "100%");
        svg.removeAttribute("height");
        svg.style.height = "auto";
        svg.style.display = "block";

        // Find the main viewport group (common in mermaid exports)
        const g = (svg.querySelector("g.svg-pan-zoom_viewport") ||
          svg.querySelector("g")) as SVGElement | null;
        if (g) {
          // Remove the transform matrix that offsets/scales content away from view
          g.removeAttribute("transform");
          g.style.transform = "";

          // Measure the natural size of the content and set as viewBox
          const bbox = (g as SVGGElement).getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            svg.setAttribute(
              "viewBox",
              `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`,
            );
          }
        }
      }
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
