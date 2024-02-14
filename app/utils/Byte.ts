export type ByteOverview = {
  title: string;
  subtitle: string;
  thumbnail: string;
  publishDate: Date;
  slug: string;
};

export type ParagraphType = {
  type: "paragraph";
  value: string;
}

export type CodeType = {
  type: "code";
  language: string;
  code: string;
}

export type CaptionedImageType = {
  type: "captionedImage";
  image: string;
  caption: string;
}

export type SectionType = {
  title: string;
  body: (ParagraphType | CodeType | CaptionedImageType)[];
}

export type Byte = {
  title: string;
  subtitle: string;
  slug: string;
  thumbnail: string;
  coverPhoto: string;
  publishDate: Date;
  lastModifiedDate: Date;
  sections: SectionType[];
};
