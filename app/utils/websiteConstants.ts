export const config = {
  websiteName: "Bytes and Nibbles",
};

// tailwind style classes
export const theme: { [key: string]: string } = {
  // colours
  primaryColourBg: "bg-black",
  secondaryColourText: "text-green-500",
  tertiaryColourText: "text-neutral-400",
  hoverColour: "hover:bg-zinc-900",
  
  // text styles
  titleStyle: "text-5xl",
  subtitleStyle: "text-2xl",
  dateStyle: "text-md",
  coverPhoto: "text-lg mt-2 sm:mt-6",
  subheadingStyle: "text-2xl font-underline mb-2",
  paragraphStyle: "text-lg",

  // margin sizes
  sectionMargin: "my-4",

  // page specifications (excl. bytes and nibbles list pages)
  pageWidth: "w-10/12 md:w-5/12",
  pageBottomMargin: "mb-6 md:mb-10",
};
