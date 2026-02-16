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
        // Set attributes to allow scaling
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        // Use style for robust constraint
        svg.style.maxWidth = "100%";
        svg.style.maxHeight = "100%";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";

        // Find the main viewport group (common in mermaid exports)
        const g = (svg.querySelector("g.svg-pan-zoom_viewport") ||
          svg.querySelector("g")) as SVGElement | null;
        if (g) {
          // Remove the transform matrix that offsets/scales content away from view
          g.removeAttribute("transform");
          g.style.transform = "";

          // Measure the natural size of the content and set as viewBox
          // We wrap in a small timeout to ensure the DOM has settled for bbox calculation
          const bbox = (g as SVGGElement).getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            // Add a small padding to the viewBox
            const padding = 10;
            svg.setAttribute(
              "viewBox",
              `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`,
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
