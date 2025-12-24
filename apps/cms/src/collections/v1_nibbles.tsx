import {
  EntityOnPreSaveProps,
  UploadedFileContext,
  buildCollection,
  buildProperty,
} from "@firecms/core";

interface Ingredient {
  name: string;
  quantity: number;
  measurement: string;
  optional: boolean;
}

export interface Nibble {
  title: string;
  thumbnail: string;
  coverPhoto: string;
  slug: string;
  source: string;
  nServings: number;
  ingredients: Ingredient[];
  steps: string[];
  isPublished: boolean;
  publishDate: Date;
  lastModifiedDate: Date;
  timeTakenMinutes: number;
}

export const v1NibbleCollection = buildCollection<Nibble>({
  id: "v1_nibbles",
  name: "Nibbles",
  singularName: "Nibble",
  path: "v1_nibbles",
  properties: {
    title: buildProperty({
      dataType: "string",
      name: "Title",
      validation: {
        required: true,
        unique: true,
      },
    }),
    thumbnail: buildProperty({
      dataType: "string",
      name: "Thumbnail",
      storage: {
        storagePath: "images/nibbles/thumbnails",
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
        storagePath: "images/nibbles/coverPhotos",
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
    source: buildProperty({
      dataType: "string",
      name: "Source",
      validation: {
        required: true,
      },
    }),
    nServings: buildProperty({
      dataType: "number",
      name: "Number of servings",
      validation: {
        required: true,
      },
    }),
    ingredients: buildProperty({
      dataType: "array",
      name: "Ingredients",
      validation: {
        required: true,
        min: 1,
      },
      of: {
        dataType: "map",
        properties: {
          name: buildProperty({
            dataType: "string",
            name: "Name",
            validation: {
              required: true,
            },
          }),
          quantity: buildProperty({
            dataType: "number",
            name: "Quantity",
          }),
          measurement: buildProperty({
            dataType: "string",
            name: "Measurement",
          }),
          optional: buildProperty({
            dataType: "boolean",
            name: "Optional",
            validation: {
              required: true,
            },
          }),
        },
      },
    }),
    steps: buildProperty({
      dataType: "array",
      name: "Steps",
      validation: {
        required: true,
        min: 1,
      },
      of: {
        dataType: "string",
        name: "step",
        validation: {
          required: true,
        },
      },
    }),
    isPublished: buildProperty({
      dataType: "boolean",
      name: "Is published?",
      validation: {
        required: true,
      },
    }),
    publishDate: buildProperty({
      dataType: "date",
      name: "Publish date",
      autoValue: "on_create",
      validation: {
        required: true,
      },
    }),
    lastModifiedDate: buildProperty({
      dataType: "date",
      name: "Last modified date",
      autoValue: "on_update",
      validation: {
        required: true,
      },
    }),
    timeTakenMinutes: buildProperty({
      dataType: "number",
      name: "Time taken (minutes)",
      validation: {
        required: true,
      },
    }),
  },
  callbacks: {
    onPreSave: async ({ values, previousValues }: EntityOnPreSaveProps) => {
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
