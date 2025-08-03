import { z } from 'zod';

// Jira Schemas
export const JiraSearchOptionsSchema = z.object({
  assignee: z.string().optional(),
  creator: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  updatedAfter: z.string().optional(),
  updatedBefore: z.string().optional(),
  project: z.string().optional(),
  status: z.string().optional(),
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
  }),
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
  limit: z.number().min(1).max(100).default(25),
  start: z.number().min(0).default(0),
});

export const ConfluencePageSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.string(),
  title: z.string(),
  space: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  version: z.object({
    number: z.number(),
    when: z.string(),
    by: z.object({
      type: z.string(),
      accountId: z.string(),
      displayName: z.string(),
    }),
  }),
  _links: z.object({
    webui: z.string(),
    self: z.string(),
  }),
  _expandable: z.object({
    container: z.string(),
    metadata: z.string(),
    operations: z.string(),
    children: z.string(),
    restrictions: z.string(),
    history: z.string(),
    ancestors: z.string(),
    body: z.string(),
    descendants: z.string(),
  }).optional(),
});

export const ConfluenceSearchResultSchema = z.object({
  results: z.array(ConfluencePageSchema),
  start: z.number(),
  limit: z.number(),
  size: z.number(),
  _links: z.object({
    base: z.string(),
    context: z.string(),
    self: z.string(),
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
