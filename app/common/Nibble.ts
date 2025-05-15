/**
 * Represents an overview of a Nibble (recipe) for display in listings
 */
export interface NibbleOverview {
  /** Title of the recipe */
  title: string;
  /** URL to the thumbnail image */
  thumbnail: string;
  /** URL to the cover photo displayed at the top of the recipe */
  coverPhoto: string;
  /** URL-friendly unique identifier */
  slug: string;
  /** Date when the recipe was published */
  publishDate: Date;
  /** Time it takes to prepare the recipe in minutes */
  timeTakenMinutes: number;
}

/**
 * Represents an ingredient in a recipe
 */
export interface Ingredient {
  /** Name of the ingredient */
  name: string;
  /** Quantity of the ingredient (can be null for "to taste" items) */
  quantity: number;
  /** Unit of measurement (e.g., "g", "tbsp", "cup") */
  measurement: string;
  /** Whether the ingredient is optional */
  optional: boolean;
}

/**
 * Represents a complete Nibble (recipe) with all content
 */
export interface Nibble extends NibbleOverview {
  /** Source of the recipe (URL or text reference) */
  source: string;
  /** Number of servings the recipe yields */
  nServings: number;
  /** List of ingredients required for the recipe */
  ingredients: Ingredient[];
  /** Ordered list of steps to prepare the recipe */
  steps: string[];
  /** Date when the recipe was last modified */
  lastModifiedDate: Date;
}
