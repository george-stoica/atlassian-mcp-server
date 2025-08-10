# Schema Issues and Fixes Plan

## Overview
This document outlines all identified schema-related issues in the Atlassian MCP Server project and provides a comprehensive plan for fixing them.

## Issues Identified

### 1. Confluence Schema Validation Errors
**Problem**: The Confluence API response doesn't match the expected schema, causing validation failures.

**Specific Issues**:
- `parentId` can be `null` but schema expects `string` or `undefined`
- `type` field is missing from some responses but marked as required
- `space` object is missing from some responses but marked as required
- `version.when` and `version.by` fields are missing from some responses but marked as required
- API v2 response structure differs from schema expectations

### 2. Schema Type Mismatches
**Problem**: Zod schemas don't properly handle nullable fields and optional properties.

**Specific Issues**:
- `parentId` should allow `null` values
- Several required fields should be optional based on actual API responses
- Union types not properly handled for some fields

### 3. API Version Inconsistencies
**Problem**: Using Confluence API v2 but schemas expect v1 response structure.

**Specific Issues from API v2**:
- `spaceId` field instead of nested `space` object in basic responses
- `parentId` can be null and is a direct field
- `parentType` field is present and indicates type ("page")
- `position`, `authorId`, `ownerId`, `lastOwnerId` fields are present
- `createdAt` field instead of `created`
- `version` structure is different (has `createdAt`, `authorId`, `minorEdit`)
- `_links` structure is different (no `self`, has `editui`, `tinyui`)
- No pagination `start`/`size` fields, uses cursor-based pagination

### 4. Missing Error Handling Schemas
**Problem**: No schemas for error responses from Atlassian APIs.

## Fix Plan

### Phase 1: Confluence API v2 Schema Modernization

#### 1.1 Update ConfluencePageSchema for API v2
```typescript
export const ConfluencePageV2Schema = z.object({
  id: z.string(),
  status: z.string(), // "current", "trashed", etc.
  title: z.string(),
  spaceId: z.string(), // Direct field in v2, not nested object
  parentId: z.string().nullable().optional(), // Can be null in v2
  parentType: z.string().optional(), // "page" typically
  position: z.number().optional(), // Position in hierarchy
  authorId: z.string().optional(), // Author account ID
  ownerId: z.string().optional(), // Owner account ID
  lastOwnerId: z.string().optional(), // Last owner account ID
  subtype: z.string().optional(), // Page subtype
  createdAt: z.string().optional(), // ISO date string, different from v1
  version: z.object({
    createdAt: z.string(), // Version creation date
    message: z.string().optional(), // Version message
    number: z.number(), // Version number
    minorEdit: z.boolean().optional(), // Minor edit flag
    authorId: z.string(), // Version author ID
  }).optional(),
  body: z.object({
    storage: z.object({}).optional(),
    atlas_doc_format: z.object({}).optional(),
    view: z.object({}).optional(),
  }).optional(),
  _links: z.object({
    webui: z.string(), // Web UI link
    editui: z.string().optional(), // Edit UI link
    tinyui: z.string().optional(), // Tiny UI link
    base: z.string().optional(), // Base URL
  }),
  // Extended optional fields for detailed responses
  labels: z.object({
    results: z.array(z.object({
      id: z.string(),
      name: z.string(),
      prefix: z.string().optional(),
    })),
    meta: z.object({
      hasMore: z.boolean(),
      cursor: z.string().optional(),
    }),
    _links: z.object({
      self: z.string(),
    }),
  }).optional(),
  properties: z.object({}).optional(),
  operations: z.object({}).optional(),
  likes: z.object({}).optional(),
  versions: z.object({}).optional(),
  isFavoritedByCurrentUser: z.boolean().optional(),
});
```

#### 1.2 Update ConfluenceSearchResultSchema for API v2
```typescript
export const ConfluenceSearchResultV2Schema = z.object({
  results: z.array(ConfluencePageV2Schema),
  _links: z.object({
    next: z.string().optional(), // Cursor-based pagination
    base: z.string().optional(), // Base URL
    context: z.string().optional(), // Context path
  }),
  // Note: v2 uses cursor-based pagination, not start/limit/size
});
```

#### 1.3 Legacy v1 Schema (for backward compatibility)
```typescript
export const ConfluencePageV1Schema = z.object({
  id: z.string(),
  type: z.string().optional(),
  status: z.string().optional(),
  title: z.string(),
  space: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }).optional(),
  version: z.object({
    number: z.number(),
    when: z.string(), // ISO date string
    by: z.object({
      type: z.string(), // 'user'
      accountId: z.string(),
      displayName: z.string(),
    }),
  }).optional(),
  _links: z.object({
    webui: z.string(),
    self: z.string().optional(),
    base: z.string().optional(),
  }),
  body: z.object({}).optional(),
  parentId: z.string().nullable().optional(),
  ancestors: z.array(z.any()).optional(),
});
```

#### 1.2 Update ConfluenceSearchResultSchema for API v2
```typescript
export const ConfluenceSearchResultV2Schema = z.object({
  results: z.array(ConfluencePageV2Schema),
  _links: z.object({
    next: z.string().optional(), // Cursor-based pagination
    base: z.string().optional(), // Base URL
    context: z.string().optional(), // Context path
  }),
  // Note: v2 uses cursor-based pagination, not start/limit/size
});
```

#### 1.3 Legacy v1 Schema (for backward compatibility)
```typescript
export const ConfluencePageV1Schema = z.object({
  id: z.string(),
  type: z.string().optional(),
  status: z.string().optional(),
  title: z.string(),
  space: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }).optional(),
  version: z.object({
    number: z.number(),
    when: z.string(), // ISO date string
    by: z.object({
      type: z.string(), // 'user'
      accountId: z.string(),
      displayName: z.string(),
    }),
  }).optional(),
  _links: z.object({
    webui: z.string(),
    self: z.string().optional(),
    base: z.string().optional(),
  }),
  body: z.object({}).optional(),
  parentId: z.string().nullable().optional(),
  ancestors: z.array(z.any()).optional(),
});
```

#### 1.4 API Version Detection and Unified Interface
```typescript
export const ConfluencePageSchema = z.union([
  ConfluencePageV2Schema,
  ConfluencePageV1Schema
]);

export const ConfluenceSearchResultSchema = z.union([
  ConfluenceSearchResultV2Schema,
  z.object({
    results: z.array(ConfluencePageV1Schema),
    start: z.number(),
    limit: z.number(),
    size: z.number(),
    _links: z.object({
      context: z.string(),
      self: z.string(),
      base: z.string().optional(),
      next: z.string().optional(),
      prev: z.string().optional(),
    }),
  })
]);
```

### Phase 2: Add Error Response Schemas

#### 2.1 Atlassian Error Schema
```typescript
export const AtlassianErrorSchema = z.object({
  errorMessages: z.array(z.string()).optional(),
  errors: z.record(z.string()).optional(),
  message: z.string().optional(),
});
```

#### 2.2 HTTP Error Response Schema
```typescript
export const HTTPErrorResponseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  data: AtlassianErrorSchema.optional(),
});
```

### Phase 3: Improve Nullable Field Handling

#### 3.1 Update JiraTicketFieldsSchema
```typescript
export const JiraTicketFieldsSchema = z.object({
  summary: z.string(),
  description: z.any().nullable().optional(), // Explicitly allow null
  status: z.object({
    name: z.string(),
    statusCategory: z.object({
      key: z.string(),
      name: z.string(),
    }),
  }),
  assignee: z.object({
    accountId: z.string(),
    displayName: z.string(),
    emailAddress: z.string().optional(),
  }).nullable().optional(), // Explicitly allow null
  creator: z.object({
    accountId: z.string(),
    displayName: z.string(),
    emailAddress: z.string().optional(),
  }).nullable().optional(), // Explicitly allow null
  reporter: z.object({
    accountId: z.string(),
    displayName: z.string(),
    emailAddress: z.string().optional(),
  }).nullable().optional(), // Explicitly allow null
  created: z.string(),
  updated: z.string(),
  priority: z.object({
    name: z.string(),
    id: z.string(),
  }).nullable().optional(), // Explicitly allow null
  issuetype: z.object({
    name: z.string(),
    id: z.string(),
  }),
  project: z.object({
    key: z.string(),
    name: z.string(),
    id: z.string(),
  }),
});
```

### Phase 4: Add API v2 Response Validation and Transformation

#### 4.1 Flexible Confluence Response Schema
```typescript
// Schema that accepts various Confluence API response formats
export const FlexibleConfluenceResponseSchema = z.object({
  results: z.array(z.record(z.any())), // Accept any object structure
  _links: z.record(z.string()).optional(),
  // v1 pagination fields
  start: z.number().optional(),
  limit: z.number().optional(),
  size: z.number().optional(),
});
```

#### 4.2 Response Transformation Functions for API v2
```typescript
// Transform API v2 response to unified format
export function transformConfluenceV2Response(rawResponse: any): ConfluenceSearchResult {
  return {
    results: rawResponse.results.map((page: any) => ({
      id: page.id,
      type: 'page', // Default type
      status: page.status,
      title: page.title,
      space: page.spaceId ? {
        id: page.spaceId,
        key: '', // Not provided in v2 basic response
        name: '', // Not provided in v2 basic response
      } : undefined,
      version: page.version ? {
        number: page.version.number,
        when: page.version.createdAt || page.createdAt,
        by: {
          type: 'user',
          accountId: page.version.authorId || page.authorId,
          displayName: '', // Not provided in v2 basic response
        },
      } : undefined,
      _links: {
        webui: page._links.webui,
        self: page._links.editui,
        base: page._links.base,
      },
      body: page.body,
      parentId: page.parentId,
      ancestors: [], // Not typically provided in v2 basic response
    })),
    start: 0, // v2 uses cursor pagination
    limit: rawResponse.results.length,
    size: rawResponse.results.length,
    _links: {
      context: rawResponse._links.context || '',
      self: rawResponse._links.base || '',
      base: rawResponse._links.base,
      next: rawResponse._links.next,
      prev: undefined, // v2 doesn't have prev
    },
  };
}

// Transform unified format back to API v2 compatible
export function transformToConfluenceV2Format(unifiedPage: ConfluencePage): any {
  return {
    id: unifiedPage.id,
    status: unifiedPage.status || 'current',
    title: unifiedPage.title,
    spaceId: unifiedPage.space?.id,
    parentId: unifiedPage.parentId,
    parentType: 'page',
    authorId: unifiedPage.version?.by.accountId,
    createdAt: unifiedPage.version?.when,
    version: unifiedPage.version ? {
      createdAt: unifiedPage.version.when,
      number: unifiedPage.version.number,
      authorId: unifiedPage.version.by.accountId,
    } : undefined,
    body: unifiedPage.body,
    _links: {
      webui: unifiedPage._links.webui,
      editui: unifiedPage._links.self,
      base: unifiedPage._links.base,
    },
  };
}
```

### Phase 5: Update Type Definitions

#### 5.1 Update ConfluencePage interface for API v2 compatibility
```typescript
export interface ConfluencePage {
  id: string;
  type?: string; // Optional, derived in transformation
  status?: string;
  title: string;
  
  // API v2 fields
  spaceId?: string; // Direct field in v2
  parentId?: string | null; // Allow null in v2
  parentType?: string; // "page" typically
  position?: number; // Position in hierarchy
  authorId?: string; // Author account ID
  ownerId?: string; // Owner account ID  
  lastOwnerId?: string; // Last owner account ID
  subtype?: string; // Page subtype
  createdAt?: string; // ISO date string in v2
  
  // Legacy v1 fields for backward compatibility
  space?: {
    id: string;
    key: string;
    name: string;
  };
  version?: {
    number: number;
    when: string;
    by: {
      type: string;
      accountId: string;
      displayName: string;
    };
    // v2 additional fields
    createdAt?: string;
    message?: string;
    minorEdit?: boolean;
    authorId?: string;
  };
  _links: {
    webui: string;
    self?: string;
    base?: string;
    // v2 additional links
    editui?: string;
    tinyui?: string;
  };
  body?: Record<string, any>;
  ancestors?: any[];
  
  // Extended v2 fields
  labels?: {
    results: Array<{
      id: string;
      name: string;
      prefix?: string;
    }>;
    meta: {
      hasMore: boolean;
      cursor?: string;
    };
    _links: {
      self: string;
    };
  };
  properties?: Record<string, any>;
  operations?: Record<string, any>;
  likes?: Record<string, any>;
  versions?: Record<string, any>;
  isFavoritedByCurrentUser?: boolean;
}

export interface ConfluenceSearchResult {
  results: ConfluencePage[];
  
  // v1 pagination (for backward compatibility)
  start?: number;
  limit?: number;
  size?: number;
  
  _links: {
    context?: string;
    self?: string;
    base?: string;
    next?: string;
    prev?: string;
  };
}
```

### Phase 6: Service Layer Updates

#### 6.1 Update ConfluenceService for API v2
- Modify API endpoint calls to use v2 format
- Add response transformation from v2 to unified format  
- Implement cursor-based pagination handling
- Add spaceId resolution (since v2 doesn't return space details in basic calls)
- Handle different field mappings between v1 and v2

#### 6.2 Update Error Handling with API v2 compatibility
```typescript
private async handleApiResponse<T>(
  response: any, 
  preferredSchema: z.ZodSchema<T>
): Promise<T> {
  try {
    // Try v2 schema first
    return ConfluencePageV2Schema.parse(response);
  } catch (v2Error) {
    try {
      // Fallback to v1 schema
      return ConfluencePageV1Schema.parse(response);
    } catch (v1Error) {
      // Use flexible schema and transform
      console.warn('Schema validation failed, using flexible parsing:', {
        v2Error: v2Error.message,
        v1Error: v1Error.message
      });
      return this.transformFlexibleResponse(response);
    }
  }
}

private transformFlexibleResponse(response: any): any {
  // Detect API version based on response structure
  if (response.spaceId && response.createdAt) {
    // Looks like v2 format
    return transformConfluenceV2Response(response);
  } else {
    // Assume v1 format or unknown
    return response;
  }
}
```

#### 6.3 Update Service Methods for API v2
```typescript
// Update buildCQLQuery for v2 compatibility
private buildCQLQuery(options: ConfluenceSearchOptions): string {
  const conditions: string[] = [];

  // Add text search condition
  if (options.query.trim()) {
    conditions.push(`text ~ "${options.query.trim()}"`);
  }

  // Handle space filtering differently in v2
  const spaceKey = options.spaceKey ?? this.devopsSpaceKey;
  if (spaceKey) {
    // v2 uses space.key syntax in CQL
    conditions.push(`space.key = "${spaceKey}"`);
  }

  // Add type filter
  conditions.push(`type = "${options.type}"`);

  return conditions.join(' AND ');
}

// Update searchPages method for v2 pagination
async searchPages(options: ConfluenceSearchOptions): Promise<ConfluenceSearchResult | ConfluenceSearchLinksResult> {
  const validatedOptions = ConfluenceSearchOptionsSchema.parse(options);

  const params: Record<string, string | number> = {
    cql: this.buildCQLQuery(validatedOptions as ConfluenceSearchOptions),
    limit: validatedOptions.limit,
    // v2 uses cursor instead of start
    cursor: validatedOptions.cursor || '',
  };

  try {
    const response = await this.client.get('/pages', { params });

    // Try v2 schema first, fallback to transformation
    try {
      const apiResult = ConfluenceSearchResultV2Schema.parse(response.data);
      
      if (validatedOptions.outputFormat === 'links_only') {
        const links = apiResult.results.map(page => `${this.baseUrl}${page._links.webui}`);
        return {
          links,
          total: apiResult.results.length,
          start: 0, // v2 doesn't have start
          limit: validatedOptions.limit,
        };
      }

      // Transform v2 response to unified format
      return transformConfluenceV2Response(apiResult);
    } catch (schemaError) {
      // Fallback to flexible parsing
      console.warn('V2 schema validation failed, using transformation:', schemaError.message);
      return this.transformFlexibleResponse(response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}
```

## Implementation Priority

### High Priority (Fix Immediately)
1. **Confluence API v2 schema compatibility** - Update schemas to match v2 response structure
2. **parentId null handling in v2** - Allow null values as per v2 API
3. **spaceId field mapping** - Handle v2's direct spaceId field vs v1's nested space object  
4. **Cursor-based pagination** - Implement v2's cursor pagination instead of start/limit
5. **Field mapping transformation** - Transform between v2 and unified format

### Medium Priority (Next Sprint)
1. **Error response schemas** - Better error handling for v2 API
2. **Space details resolution** - Fetch space details separately in v2 since not included in basic responses
3. **Backward compatibility** - Support both v1 and v2 response formats
4. **Service layer updates** - Robust API v2 interaction

### Low Priority (Future Enhancement)
1. **Comprehensive v2 validation** - Full type safety for all v2 endpoints
2. **Automatic API version detection** - Smart schema selection based on response
3. **Performance optimization** - Efficient cursor pagination handling
4. **Schema migration utilities** - Easy updates for future API changes

## Testing Strategy

### 1. Schema Validation Tests
- Test all schemas with real API responses
- Test nullable field handling
- Test optional field scenarios

### 2. API Integration Tests
- Test with actual Atlassian APIs
- Test error scenarios
- Test edge cases (empty results, malformed responses)

### 3. Backwards Compatibility Tests
- Ensure existing functionality works
- Test with different API versions
- Validate type safety

## Files to Modify

### Primary Files
- `src/schemas/atlassian.ts` - Update all schemas
- `src/types/atlassian.ts` - Update type definitions
- `src/services/confluence.ts` - Add response handling
- `src/services/jira.ts` - Improve error handling

### Test Files
- `src/__tests__/schemas.test.ts` - Add comprehensive schema tests
- `src/__tests__/confluence.test.ts` - Update test expectations
- `src/__tests__/jira.test.ts` - Add error scenario tests

### New Files
- `src/utils/confluence-transformers.ts` - API v2 response transformation utilities
- `src/schemas/confluence-v2.ts` - Confluence API v2 specific schemas
- `src/schemas/errors.ts` - Error response schemas
- `src/types/api-responses.ts` - Raw API response types for v1 and v2
- `src/types/confluence-v2.ts` - API v2 specific type definitions

## Success Criteria

1. ✅ All Confluence searches work without schema validation errors using API v2
2. ✅ Null parentId values are properly handled in v2 responses
3. ✅ spaceId field mapping works correctly between v2 and unified format
4. ✅ Cursor-based pagination is implemented for v2 API
5. ✅ Response transformation between v2 and unified format works seamlessly
6. ✅ Error responses are properly typed and handled for v2 API
7. ✅ All tests pass with updated v2 schemas
8. ✅ API responses are gracefully degraded when validation fails
9. ✅ Type safety is maintained throughout the application
10. ✅ Backward compatibility with v1 responses (if needed) is preserved

## Risk Mitigation

### Schema Breaking Changes
- Implement gradual migration with fallback schemas
- Maintain backwards compatibility for existing users
- Add comprehensive logging for validation failures

### API Version Changes for v2
- Implement automatic detection of v2 response format
- Support v2's cursor-based pagination instead of start/limit
- Handle v2's direct field structure (spaceId, authorId, createdAt, etc.)
- Implement proper transformation between v2 API format and unified interface
- Support v2's enhanced _links structure (editui, tinyui)

### Performance Impact
- Minimize validation overhead with smart schema selection
- Cache space details lookups (since v2 doesn't include full space info)
- Use efficient cursor pagination for large result sets
- Implement streaming validation for large datasets

## Rollback Plan

If schema changes cause issues:
1. Revert to previous schema versions
2. Implement emergency bypass for validation
3. Add configuration flag to disable strict validation
4. Restore working functionality first, then investigate issues

---

**Created**: August 10, 2025
**Author**: GitHub Copilot
**Status**: Ready for Implementation
