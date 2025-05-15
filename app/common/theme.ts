/**
 * Website theme configuration
 * Contains all color and layout classes used throughout the application
 */

// Theme object for cohesive design system
export const theme = {
  colours: {
    primary: {
      bg: "bg-black",
    },
    secondary: {
      fill: "fill-green-500",
      text: "text-green-500",
    },
    tertiary: {
      text: "text-neutral-400",
    },
    hover: {
      bg: "hover:bg-zinc-900",
    },
  },
  layout: {
    page: {
      width: "w-10/12 md:w-5/12",
      bottomMargin: "mb-6 md:mb-10",
    },
    tilecard: {
      textPadding: "pl-5",
    },
  },
};
