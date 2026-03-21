import {
  EntityReference,
  EntityOnFetchProps,
  EntityOnPreSaveProps,
  UploadedFileContext,
  buildCollection,
  buildProperty,
} from "@firecms/core";
import { GuardedIsPublishedField } from "../components/GuardedIsPublishedField";
import { MarkdownParagraphField } from "../components/MarkdownParagraphField";
import { LatexParagraphField } from "../components/LatexParagraphField";
import {
  ByteType as SharedByteType,
  SUBSECTION_BODY_ELEMENT_TYPES,
  SECTION_BODY_ELEMENT_TYPES,
  formatUnfinishedBytePathsForPublishError,
  listUnfinishedByteUnitPaths,
} from "@bytes-and-nibbles/shared";
import { normalizeByteSectionsForCmsForm } from "./normalizeByteBodyForCms";

// FireCMS-specific Byte interface that extends shared types with FireCMS EntityReference
interface ByteType extends Omit<SharedByteType, "series"> {
  series: EntityReference; // FireCMS-specific entity reference
}

const isFinishedProperty = buildProperty({
  dataType: "boolean",
  name: "Marked finished?",
  description:
    "Turn on when this unit is complete. Publishing requires every unit to be finished.",
  defaultValue: false,
});

// Markdown paragraph (map: text + finished flag for oneOf valueField)
const paragraphProperty = buildProperty({
  dataType: "map",
  name: "Paragraph",
  properties: {
    paragraph: buildProperty({
      dataType: "string",
      name: "Content",
      Field: MarkdownParagraphField,
      markdown: true,
      validation: {
        required: true,
      },
    }),
    is_finished: isFinishedProperty,
  },
});

const latexParagraphProperty = buildProperty({
  dataType: "map",
  name: "LaTeX block",
  properties: {
    latexContent: buildProperty({
      dataType: "string",
      name: "LaTeX content",
      Field: LatexParagraphField,
      validation: {
        required: true,
      },
    }),
    is_finished: isFinishedProperty,
  },
});

const captionedImageProperty = buildProperty({
  dataType: "map",
  name: "Captioned image",
  properties: {
    image: buildProperty({
      dataType: "string",
      name: "Image",
      storage: {
        storagePath: "images/bytes/bodyImages",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
        fileName: (context: UploadedFileContext) => {
          return context.file.name;
        },
      },
      validation: {
        required: true,
      },
    }),
    caption: buildProperty({
      dataType: "string",
      name: "Caption",
      markdown: true,
      validation: {
        required: true,
      },
    }),
    is_finished: isFinishedProperty,
  },
});

const collapsibleGroupProperty = buildProperty({
  dataType: "map",
  name: "Collapsible group",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title (optional)",
    }),
    body: buildProperty({
      dataType: "array",
      name: "Content",
      validation: { required: true, min: 1 },
      oneOf: {
        typeField: "type",
        valueField: "value",
        properties: {
          [SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]:
            latexParagraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]:
            captionedImageProperty,
        },
      },
    }),
    is_finished: isFinishedProperty,
  },
});

const subsubsectionInnerBodyProperty = buildProperty({
  dataType: "array",
  name: "Subsubsection body",
  validation: { required: true },
  oneOf: {
    typeField: "type",
    valueField: "value",
    properties: {
      [SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
      [SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]: latexParagraphProperty,
      [SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]: captionedImageProperty,
      [SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]: collapsibleGroupProperty,
    },
  },
});

const subsubsectionProperty = buildProperty({
  dataType: "map",
  name: "Subsubsection",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Subheading",
      validation: { required: true },
    }),
    body: subsubsectionInnerBodyProperty,
    isCollapsible: buildProperty({
      dataType: "boolean",
      name: "Is collapsible?",
      defaultValue: false,
    }),
    is_finished: isFinishedProperty,
  },
});

const subsectionProperty = buildProperty({
  dataType: "map",
  name: "Subsection",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Subheading",
      validation: { required: true },
    }),
    body: buildProperty({
      dataType: "array",
      name: "Subsection body",
      validation: { required: true },
      oneOf: {
        typeField: "type",
        valueField: "value",
        properties: {
          [SUBSECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]:
            latexParagraphProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]:
            captionedImageProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]:
            collapsibleGroupProperty,
          [SUBSECTION_BODY_ELEMENT_TYPES.SUBSUBSECTION]: subsubsectionProperty,
        },
      },
    }),
    isCollapsible: buildProperty({
      dataType: "boolean",
      name: "Is collapsible?",
      defaultValue: false,
    }),
    is_finished: isFinishedProperty,
  },
});

export const byteCollection = buildCollection<ByteType>({
  id: "v1_bytes",
  name: "Bytes",
  singularName: "Byte",
  path: "v1_bytes",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title",
      validation: {
        required: true,
        unique: true,
      },
    }),
    subtitle: buildProperty({
      dataType: "string",
      name: "Subtitle",
      validation: {
        required: true,
      },
    }),
    series: buildProperty({
      dataType: "reference",
      path: "v1_byte_series",
      name: "Series",
      validation: {
        required: true,
      },
    }),
    slug: buildProperty({
      dataType: "string",
      name: "Slug",
      validation: {
        required: true,
        unique: true,
        min: 5,
        matches: "^[a-z][a-z0-9-]*[a-z0-9]+$",
      },
    }),
    thumbnail: buildProperty({
      dataType: "string",
      name: "Thumbnail",
      storage: {
        storagePath: "images/bytes/thumbnails",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
        fileName: (context: UploadedFileContext) => {
          return context.file.name;
        },
      },
      validation: {
        required: true,
      },
    }),
    coverPhoto: buildProperty({
      dataType: "string",
      name: "Cover photo",
      storage: {
        storagePath: "images/bytes/coverPhotos",
        acceptedFiles: ["image/*"],
        metadata: {
          cacheControl: "max-age=1000000",
        },
        fileName: (context: UploadedFileContext) => {
          return context.file.name;
        },
      },
      validation: {
        required: true,
      },
    }),
    isPublished: buildProperty({
      dataType: "boolean",
      name: "Is published?",
      Field: GuardedIsPublishedField,
      customProps: {
        getPublishBlockMessage: (values: Record<string, unknown>) => {
          const unfinished = listUnfinishedByteUnitPaths(values);
          if (unfinished.length === 0) return null;
          return formatUnfinishedBytePathsForPublishError(unfinished);
        },
      },
      validation: {
        required: true,
      },
    }),
    publishDate: buildProperty({
      dataType: "date",
      name: "Publish date",
      autoValue: "on_create",
    }),
    lastModifiedDate: buildProperty({
      dataType: "date",
      name: "Last modified date",
      autoValue: "on_update",
    }),
    sections: buildProperty({
      dataType: "array",
      name: "Sections",
      validation: {
        required: true,
        min: 1,
      },
      of: {
        dataType: "map",
        properties: {
          title: buildProperty({
            dataType: "string",
            name: "Heading",
            validation: {
              required: true,
            },
          }),
          isCollapsible: buildProperty({
            dataType: "boolean",
            name: "Is collapsible?",
            defaultValue: false,
          }),
          is_finished: isFinishedProperty,
          body: buildProperty({
            dataType: "array",
            name: "Section body",
            validation: {
              required: true,
            },
            oneOf: {
              typeField: "type",
              valueField: "value",
              properties: {
                [SECTION_BODY_ELEMENT_TYPES.SUBSECTION]: subsectionProperty,
                [SECTION_BODY_ELEMENT_TYPES.PARAGRAPH]: paragraphProperty,
                [SECTION_BODY_ELEMENT_TYPES.LATEX_PARAGRAPH]:
                  latexParagraphProperty,
                [SECTION_BODY_ELEMENT_TYPES.CAPTIONED_IMAGE]:
                  captionedImageProperty,
                [SECTION_BODY_ELEMENT_TYPES.COLLAPSIBLE_GROUP]:
                  collapsibleGroupProperty,
              },
            },
          }),
        },
      },
    }),
  },
  callbacks: {
    onFetch: async ({ entity }: EntityOnFetchProps<ByteType>) => {
      normalizeByteSectionsForCmsForm(
        entity.values as unknown as Record<string, unknown>,
      );
      return entity;
    },
    onPreSave: async ({ values, previousValues }: EntityOnPreSaveProps) => {
      if (values.isPublished === true) {
        const unfinished = listUnfinishedByteUnitPaths(
          values as unknown as Record<string, unknown>,
        );
        if (unfinished.length > 0) {
          throw new Error(
            formatUnfinishedBytePathsForPublishError(unfinished),
          );
        }
      }

      if (
        values.isPublished === true &&
        previousValues?.isPublished === false
      ) {
        values.publishDate = new Date();
      }

      return values;
    },
  },
});
