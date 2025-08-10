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

// Confluence Schemas
export const ConfluenceSearchOptionsSchema = z.object({
  query: z.string().min(1),
  spaceKey: z.string().optional(),
  type: z.enum(['page', 'blogpost']).default('page'),
  outputFormat: z.enum(['full', 'links_only']).default('full'),
  limit: z.number().min(1).max(100).default(25),
  start: z.number().min(0).default(0),
});

export const ConfluenceSearchLinksResultSchema = z.object({
  links: z.array(z.string()),
  total: z.number(),
  start: z.number(),
  limit: z.number(),
});

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

// Export type inference
export type JiraSearchOptionsInput = z.input<typeof JiraSearchOptionsSchema>;
export type JiraSearchOptions = z.output<typeof JiraSearchOptionsSchema>;
export type ConfluenceSearchOptionsInput = z.input<typeof ConfluenceSearchOptionsSchema>;
export type ConfluenceSearchOptions = z.output<typeof ConfluenceSearchOptionsSchema>;
