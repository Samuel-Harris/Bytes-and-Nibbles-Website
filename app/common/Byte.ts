export type Series = {
  title: string;
  accentColour: string;
};

export type ByteOverview = {
  title: string;
  subtitle: string;
  series: Series;
  thumbnail: string;
  publishDate: Date;
  slug: string;
};

export type ParagraphType = {
  type: "paragraph";
  value: string;
};

export type CaptionedImageType = {
  type: "captionedImage";
  value: {
    image: string;
    caption: string;
  };
};

export type BodyType = (ParagraphType | CaptionedImageType)[];

export type SubsectionType = {
  type: "subsection";
  value: {
    title: string;
    body: BodyType;
  }
};

export type SectionType = {
  title: string;
  body: (SubsectionType | ParagraphType | CaptionedImageType)[];
};

export type Byte = {
  title: string;
  subtitle: string;
  series: Series;
  slug: string;
  thumbnail: string;
  coverPhoto: string;
  publishDate: Date;
  lastModifiedDate: Date;
  sections: SectionType[];
};
