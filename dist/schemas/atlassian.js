"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlassianConfigSchema = exports.ConfluenceSearchResultSchema = exports.ConfluencePageSchema = exports.ConfluenceSearchOptionsSchema = exports.JiraSearchResultSchema = exports.JiraTicketSchema = exports.JiraTicketFieldsSchema = exports.JiraSearchOptionsSchema = void 0;
const zod_1 = require("zod");
// Jira Schemas
exports.JiraSearchOptionsSchema = zod_1.z.object({
    assignee: zod_1.z.string().optional(),
    creator: zod_1.z.string().optional(),
    createdAfter: zod_1.z.string().datetime().optional(),
    createdBefore: zod_1.z.string().datetime().optional(),
    project: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    maxResults: zod_1.z.number().min(1).max(100).default(50),
    startAt: zod_1.z.number().min(0).default(0),
});
exports.JiraTicketFieldsSchema = zod_1.z.object({
    summary: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.object({
        name: zod_1.z.string(),
        statusCategory: zod_1.z.object({
            key: zod_1.z.string(),
            name: zod_1.z.string(),
        }),
    }),
    assignee: zod_1.z.object({
        accountId: zod_1.z.string(),
        displayName: zod_1.z.string(),
        emailAddress: zod_1.z.string(),
    }).optional(),
    creator: zod_1.z.object({
        accountId: zod_1.z.string(),
        displayName: zod_1.z.string(),
        emailAddress: zod_1.z.string(),
    }),
    reporter: zod_1.z.object({
        accountId: zod_1.z.string(),
        displayName: zod_1.z.string(),
        emailAddress: zod_1.z.string(),
    }),
    created: zod_1.z.string(),
    updated: zod_1.z.string(),
    priority: zod_1.z.object({
        name: zod_1.z.string(),
        id: zod_1.z.string(),
    }),
    issuetype: zod_1.z.object({
        name: zod_1.z.string(),
        id: zod_1.z.string(),
    }),
    project: zod_1.z.object({
        key: zod_1.z.string(),
        name: zod_1.z.string(),
        id: zod_1.z.string(),
    }),
});
exports.JiraTicketSchema = zod_1.z.object({
    id: zod_1.z.string(),
    key: zod_1.z.string(),
    self: zod_1.z.string(),
    fields: exports.JiraTicketFieldsSchema,
});
exports.JiraSearchResultSchema = zod_1.z.object({
    expand: zod_1.z.string(),
    startAt: zod_1.z.number(),
    maxResults: zod_1.z.number(),
    total: zod_1.z.number(),
    issues: zod_1.z.array(exports.JiraTicketSchema),
});
// Confluence Schemas
exports.ConfluenceSearchOptionsSchema = zod_1.z.object({
    query: zod_1.z.string().min(1),
    spaceKey: zod_1.z.string().optional(),
    type: zod_1.z.enum(['page', 'blogpost']).default('page'),
    limit: zod_1.z.number().min(1).max(100).default(25),
    start: zod_1.z.number().min(0).default(0),
});
exports.ConfluencePageSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.string(),
    status: zod_1.z.string(),
    title: zod_1.z.string(),
    space: zod_1.z.object({
        id: zod_1.z.string(),
        key: zod_1.z.string(),
        name: zod_1.z.string(),
    }),
    version: zod_1.z.object({
        number: zod_1.z.number(),
        when: zod_1.z.string(),
        by: zod_1.z.object({
            type: zod_1.z.string(),
            accountId: zod_1.z.string(),
            displayName: zod_1.z.string(),
        }),
    }),
    _links: zod_1.z.object({
        webui: zod_1.z.string(),
        self: zod_1.z.string(),
    }),
    _expandable: zod_1.z.object({
        container: zod_1.z.string(),
        metadata: zod_1.z.string(),
        operations: zod_1.z.string(),
        children: zod_1.z.string(),
        restrictions: zod_1.z.string(),
        history: zod_1.z.string(),
        ancestors: zod_1.z.string(),
        body: zod_1.z.string(),
        descendants: zod_1.z.string(),
    }).optional(),
});
exports.ConfluenceSearchResultSchema = zod_1.z.object({
    results: zod_1.z.array(exports.ConfluencePageSchema),
    start: zod_1.z.number(),
    limit: zod_1.z.number(),
    size: zod_1.z.number(),
    _links: zod_1.z.object({
        base: zod_1.z.string(),
        context: zod_1.z.string(),
        self: zod_1.z.string(),
    }),
});
// Configuration Schema
exports.AtlassianConfigSchema = zod_1.z.object({
    jira: zod_1.z.object({
        baseUrl: zod_1.z.string().url(),
        email: zod_1.z.string().email(),
        apiToken: zod_1.z.string().min(1),
    }),
    confluence: zod_1.z.object({
        baseUrl: zod_1.z.string().url(),
        email: zod_1.z.string().email(),
        apiToken: zod_1.z.string().min(1),
    }),
});
//# sourceMappingURL=atlassian.js.map