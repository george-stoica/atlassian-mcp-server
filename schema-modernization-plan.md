# Schema Modernization Plan for Confluence API v2

## Problem Analysis

The current schema definitions in `src/schemas/atlassian.ts` and type definitions in `src/types/atlassian.ts` are based on an older version of the Confluence API and contain a mix of both old and new fields. The tests are failing because the mock data follows the actual Confluence API v2 response format, but the schema validation expects the old format.

## Current Issues

### 1. ConfluencePageSchema Issues
The current schema includes both old and new API fields, making it inconsistent:

**Old API fields that should be removed:**
- `parentId` (string | null) - Not in API v2
- `spaceId` (string) - Not in API v2  
- `ownerId` (string) - Not in API v2
- `lastOwnerId` (string | null) - Not in API v2
- `createdAt` (string) - Not in API v2
- `authorId` (string) - Not in API v2
- `parentType` (string | null) - Not in API v2
- `position` (any | null) - Not in API v2

**Version object inconsistencies:**
- Has both old fields (`message`, `minorEdit`, `authorId`, `createdAt`, `ncsStepVersion`) and new fields (`when`, `by`)
- Should only have API v2 fields

**Links object inconsistencies:**
- Has both old fields (`editui`, `edituiv2`, `tinyui`) and new fields (`self`)
- Should only have API v2 fields

### 2. Type Definition Issues
The `ConfluencePage` interface in `src/types/atlassian.ts` is also outdated and needs to match the schema.

### 3. Mock Data vs Schema Mismatch
The test mock data (`mockApiSearchResult`) follows the correct API v2 format, but the schema expects the old format.

## Solution Plan

### Phase 1: Update Confluence Schema to API v2 Format

#### 1.1 Update ConfluencePageSchema
Replace the current `ConfluencePageSchema` with API v2 compliant schema:

```typescript
export const ConfluencePageSchema = z.object({
  id: z.string(),
  type: z.string(), // 'page' or 'blogpost'
  status: z.string(), // 'current', 'trashed', etc.
  title: z.string(),
  space: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  version: z.object({
    number: z.number(),
    when: z.string(), // ISO date string
    by: z.object({
      type: z.string(), // 'user'
      accountId: z.string(),
      displayName: z.string(),
    }),
  }),
  _links: z.object({
    webui: z.string(),
    self: z.string().optional(),
  }),
  // Optional fields for extended responses
  body: z.object({}).optional(),
  parentId: z.string().optional(),
  ancestors: z.array(z.any()).optional(),
});
```

#### 1.2 Update ConfluenceSearchResultSchema
Ensure it matches the actual API v2 response:

```typescript
export const ConfluenceSearchResultSchema = z.object({
  results: z.array(ConfluencePageSchema),
  start: z.number(),
  limit: z.number(),
  size: z.number(),
  _links: z.object({
    context: z.string(),
    self: z.string(),
    base: z.string(),
    next: z.string().optional(),
    prev: z.string().optional(),
  }),
});
```

### Phase 2: Update Type Definitions

#### 2.1 Update ConfluencePage Interface
Replace the current interface in `src/types/atlassian.ts`:

```typescript
export interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  space: {
    id: string;
    key: string;
    name: string;
  };
  version: {
    number: number;
    when: string;
    by: {
      type: string;
      accountId: string;
      displayName: string;
    };
  };
  _links: {
    webui: string;
    self?: string;
  };
  body?: Record<string, any>;
  parentId?: string;
  ancestors?: any[];
}
```

#### 2.2 Update ConfluenceSearchResult Interface
```typescript
export interface ConfluenceSearchResult {
  results: ConfluencePage[];
  start: number;
  limit: number;
  size: number;
  _links: {
    context: string;
    self: string;
    base: string;
    next?: string;
    prev?: string;
  };
}
```

### Phase 3: Update Test Mock Data

#### 3.1 Update mockConfluencePage
Align with the new schema:

```typescript
const mockConfluencePage: ConfluencePage = {
  id: '123456',
  type: 'page',
  status: 'current',
  title: 'Test Page Title',
  space: {
    id: '98765',
    key: 'DEVOPS',
    name: 'DevOps Space'
  },
  version: {
    number: 1,
    when: '2024-01-01T10:00:00.000Z',
    by: {
      type: 'user',
      accountId: 'user-123',
      displayName: 'Test User'
    }
  },
  _links: {
    webui: '/spaces/DEVOPS/pages/123456/Test+Page+Title',
    self: 'https://test.atlassian.net/wiki/api/v2/pages/123456'
  }
};
```

#### 3.2 Update mockSearchResult
```typescript
const mockSearchResult: ConfluenceSearchResult = {
  results: [mockConfluencePage],
  start: 0,
  limit: 25,
  size: 1,
  _links: {
    context: 'https://test.atlassian.net/wiki',
    self: 'https://test.atlassian.net/wiki/api/v2/pages',
    base: 'https://test.atlassian.net/wiki'
  }
};
```

### Phase 4: Update Service Layer (if needed)

#### 4.1 Review ConfluenceService
Check if any service methods need updates to handle the new schema:
- `searchPages()` - Should work with new schema
- `getPagesBySpace()` - Should work with new schema
- `getPageById()` - May need schema updates for single page responses

#### 4.2 Update Return Type Transformations
Ensure that any data transformations in the service layer work with the new schema.

## Implementation Steps

1. **Update Schema File** (`src/schemas/atlassian.ts`)
   - Replace `ConfluencePageSchema` with API v2 compliant version
   - Update `ConfluenceSearchResultSchema` to match API v2
   - Remove all deprecated fields

2. **Update Type Definitions** (`src/types/atlassian.ts`)
   - Replace `ConfluencePage` interface with API v2 compliant version
   - Update `ConfluenceSearchResult` interface to match API v2
   - Remove all deprecated fields

3. **Update Test Mock Data** (`src/__tests__/confluence.test.ts`)
   - Update `mockConfluencePage` to use new structure
   - Update `mockSearchResult` to use new structure
   - Ensure `mockApiSearchResult` matches the schema exactly

4. **Test and Validate**
   - Run tests to ensure all schema validations pass
   - Verify that the actual API responses match the new schema
   - Test edge cases and optional fields

## Benefits

1. **API Consistency**: Schema now matches actual Confluence API v2 responses
2. **Simplified Structure**: Removed deprecated fields and legacy API remnants
3. **Better Validation**: More accurate validation of API responses
4. **Future-Proof**: Aligned with current Confluence API version

## Risk Assessment

**Low Risk**: This change primarily removes deprecated fields and aligns the schema with the actual API responses. The service layer logic remains unchanged, and the tests will validate that everything works correctly.

## Files to Modify

1. `src/schemas/atlassian.ts` - Schema definitions
2. `src/types/atlassian.ts` - Type interfaces  
3. `src/__tests__/confluence.test.ts` - Mock data and test expectations

## Validation Checklist

After implementation:
- [ ] All Confluence tests pass
- [ ] Schema validation succeeds with mock data
- [ ] No TypeScript compilation errors
- [ ] Service methods work with new types
- [ ] Mock data structure matches real API responses
