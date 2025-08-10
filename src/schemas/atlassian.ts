import { z } from 'zod';

// Jira Schemas
export const JiraSearchOptionsSchema = z.object({
  // User/Role filters
  assignee: z.string().optional(),
  creator: z.string().optional(),
  team: z.string().optional(),
  teamIdentifier: z.string().optional(),
  
  // Project/Status filters
  project: z.string().optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
  
  // Date filters
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  updatedAfter: z.string().optional(),
  updatedBefore: z.string().optional(),
  
  // Text search options
  textSearch: z.string().optional(),
  summarySearch: z.string().optional(),
  descriptionSearch: z.string().optional(),
  textSearchTerms: z.array(z.string()).optional(),
  summaryTerms: z.array(z.string()).optional(),
  descriptionTerms: z.array(z.string()).optional(),
  
  // Pagination
  maxResults: z.number().min(1).max(100).default(50),
  startAt: z.number().min(0).default(0),
});

export const JiraTicketFieldsSchema = z.object({
  summary: z.string(),
  description: z.any().optional(), // Accept any format for description (string, object, or null)
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
  }).optional().nullable(),
  creator: z.object({
    accountId: z.string(),
    displayName: z.string(),
    emailAddress: z.string().optional(),
  }).optional().nullable(),
  reporter: z.object({
    accountId: z.string(),
    displayName: z.string(),
    emailAddress: z.string().optional(),
  }).optional().nullable(),
  created: z.string(),
  updated: z.string(),
  priority: z.object({
    name: z.string(),
    id: z.string(),
  }).optional().nullable(),
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

export const JiraTicketSchema = z.object({
  id: z.string(),
  key: z.string(),
  self: z.string(),
  fields: JiraTicketFieldsSchema,
});

export const JiraSearchResultSchema = z.object({
  expand: z.string().optional(),
  startAt: z.number(),
  maxResults: z.number(),
  total: z.number(),
  issues: z.array(JiraTicketSchema),
});

// Confluence Schemas for API v2
export const ConfluenceSearchOptionsSchema = z.object({
  query: z.string(), // Allow empty string for getting all pages in a space
  spaceKey: z.string().optional(),
  type: z.enum(['page', 'blogpost']).default('page'),
  outputFormat: z.enum(['full', 'links_only']).default('full'),
  limit: z.number().min(1).max(100).default(25),
  cursor: z.string().optional(), // v2 uses cursor-based pagination
});

export const ConfluenceSearchLinksResultSchema = z.object({
  links: z.array(z.string()),
  total: z.number(),
  limit: z.number(),
});

// Confluence API v2 Page Schema
export const ConfluencePageV2Schema = z.object({
  id: z.string(),
  status: z.string(), // "current", "trashed", etc.
  title: z.string(),
  spaceId: z.string(), // Direct field in v2, not nested object
  parentId: z.string().nullable().optional(), // Can be null in v2
  parentType: z.string().nullable().optional(), // Can be null - "page" typically
  position: z.number().nullable().optional(), // Can be null - position in hierarchy
  authorId: z.string().optional(), // Author account ID
  ownerId: z.string().optional(), // Owner account ID
  lastOwnerId: z.string().nullable().optional(), // Can be null - last owner account ID
  subtype: z.string().optional(), // Page subtype
  createdAt: z.string().optional(), // ISO date string, different from v1
  version: z.object({
    createdAt: z.string(), // Version creation date
    message: z.string().optional(), // Version message
    number: z.number(), // Version number
    minorEdit: z.boolean().optional(), // Minor edit flag
    authorId: z.string(), // Version author ID
    ncsStepVersion: z.number().nullable().optional(), // Can be null - additional v2 field
  }).optional(),
  body: z.object({
    storage: z.object({}).optional(),
    atlas_doc_format: z.object({}).optional(),
    view: z.object({}).optional(),
  }).optional(),
  _links: z.object({
    webui: z.string(), // Web UI link
    editui: z.string().optional(), // Edit UI link
    edituiv2: z.string().optional(), // Edit UI v2 link
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

// Use v2 schema as the main schema
export const ConfluencePageSchema = ConfluencePageV2Schema;

// Confluence API v2 Search Result Schema
export const ConfluenceSearchResultV2Schema = z.object({
  results: z.array(ConfluencePageV2Schema),
  _links: z.object({
    next: z.string().optional(), // Cursor-based pagination
    base: z.string().optional(), // Base URL
    context: z.string().optional(), // Context path
  }),
  // Note: v2 uses cursor-based pagination, not start/limit/size
});

// Use v2 schema as the main schema
export const ConfluenceSearchResultSchema = ConfluenceSearchResultV2Schema;

// Flexible schema for transformation fallback
export const FlexibleConfluenceResponseSchema = z.object({
  results: z.array(z.record(z.any())), // Accept any object structure
  _links: z.record(z.string()).optional(),
});

// Configuration Schema
export const AtlassianConfigSchema = z.object({
  jira: z.object({
    baseUrl: z.string().url(),
    email: z.string().email(),
    apiToken: z.string().min(1),
  }),
  confluence: z.object({
    baseUrl: z.string().url(),
    email: z.string().email(),
    apiToken: z.string().min(1),
  }),
});

// Error Response Schemas
export const AtlassianErrorSchema = z.object({
  errorMessages: z.array(z.string()).optional(),
  errors: z.record(z.string()).optional(),
  message: z.string().optional(),
});

export const HTTPErrorResponseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  data: AtlassianErrorSchema.optional(),
});

// Export type inference
export type JiraSearchOptionsInput = z.input<typeof JiraSearchOptionsSchema>;
export type JiraSearchOptions = z.output<typeof JiraSearchOptionsSchema>;
export type ConfluenceSearchOptionsInput = z.input<typeof ConfluenceSearchOptionsSchema>;
export type ConfluenceSearchOptions = z.output<typeof ConfluenceSearchOptionsSchema>;
export type ConfluencePageV2 = z.output<typeof ConfluencePageV2Schema>;
export type ConfluenceSearchResultV2 = z.output<typeof ConfluenceSearchResultV2Schema>;
