<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-02-08 | Updated: 2026-02-16 -->

# common

## Purpose

Shared utilities, services, and constants used across the website application.

## Key Files

| File                      | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `FirebaseService.ts`      | Singleton service for fetching data from Firebase |
| `FirebaseService.test.ts` | Comprehensive tests for the Firebase service      |
| `constants.ts`            | Website name and metadata constants               |
| `collectionConstants.ts`  | Firestore collection names and field mappings     |
| `theme.ts`                | Color constants for consistent theming            |
| `timeUtils.ts`            | Time formatting utilities                         |
| `timeUtils.test.ts`       | Tests for time utilities                          |
| `HighlightedText.tsx`     | Reusable text highlighting component              |

## For AI Agents

### Working In This Directory

- `FirebaseService` is a **singleton** - use `await FirebaseService.getInstance()`
- Service fetches all published bytes and nibbles on initialization
- Byte `captionedImage` storage paths are resolved to download URLs at every nesting level
- Data is cached in memory after first fetch
- Theme colors are Tailwind CSS class strings

### FirebaseService API

```typescript
// Get singleton instance (fetches data on first call)
const service = await FirebaseService.getInstance();

// List content
service.listBytes(): ByteOverviewType[]
service.listNibbles(): NibbleOverviewType[]

// Get single item by slug
service.getByte(slug: string): ByteSchema | undefined
service.getNibble(slug: string): NibbleSchema | undefined

// Get all slugs (for static generation)
service.getByteSlugs(): string[]
service.getNibbleSlugs(): string[]

// Get image URL from storage path
service.getImage(path: string): Promise<string>
```

### Testing Requirements

- Mock Firebase modules in tests
- `FirebaseService.test.ts` has comprehensive test examples
- Use `vi.mock()` for Firebase SDK functions (Vitest)

<!-- MANUAL: -->
