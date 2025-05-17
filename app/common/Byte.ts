/**
 * Represents a blog series with a title and accent color
 */
export interface Series {
  /** The title of the series */
  title: string;
  /** The accent color used for UI elements related to this series */
  accentColour: string;
}

/**
 * Represents the overview information for a Byte (tech blog post)
 * Used in listing page.
 */
export interface ByteOverview {
  /** The title of the blog post */
  title: string;
  /** The subtitle/description of the blog post */
  subtitle: string;
  /** The series this blog post belongs to */
  series: Series;
  /** URL to the thumbnail image */
  thumbnail: string;
  /** Publication date */
  publishDate: Date;
  /** URL-friendly unique identifier */
  slug: string;
}

/**
 * Represents a paragraph content block in a blog post
 */
export interface ParagraphType {
  type: "paragraph";
  /** The text content of the paragraph */
  value: string;
}

/**
 * Represents an image with a caption content block
 */
export interface CaptionedImageType {
  type: "captionedImage";
  value: {
    /** URL to the image */
    image: string;
    /** Caption text for the image */
    caption: string;
  };
}

/**
 * Represents an array of content blocks that can be paragraphs or captioned images
 */
export type BodyType = (ParagraphType | CaptionedImageType)[];

/**
 * Represents a subsection within a main section
 */
export interface SubsectionType {
  type: "subsection";
  value: {
    /** The title of the subsection */
    title: string;
    /** The content blocks within this subsection */
    body: BodyType;
  };
}

/**
 * Represents a main section in a blog post
 */
export interface SectionType {
  /** The title of the section */
  title: string;
  /** The content blocks within this section, which can include subsections */
  body: (SubsectionType | ParagraphType | CaptionedImageType)[];
}

/**
 * Represents a complete Byte (tech blog post) with all content
 */
export interface Byte extends ByteOverview {
  /** URL to the cover photo displayed at the top of the post */
  coverPhoto: string;
  /** Date when the post was last modified */
  lastModifiedDate: Date;
  /** The content sections of the blog post */
  sections: SectionType[];
}
