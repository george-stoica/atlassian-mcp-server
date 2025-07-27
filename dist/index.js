#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlassianMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const dotenv = __importStar(require("dotenv"));
const jira_js_1 = require("./services/jira.js");
const confluence_js_1 = require("./services/confluence.js");
const atlassian_js_1 = require("./schemas/atlassian.js");
const atlassian_js_2 = require("./schemas/atlassian.js");
// Load environment variables
dotenv.config();
class AtlassianMCPServer {
    constructor() {
        this.server = new index_js_1.Server({
            name: process.env.MCP_SERVER_NAME || 'Atlassian MCP Server',
            version: process.env.MCP_SERVER_VERSION || '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize services
        this.initializeServices();
        this.setupHandlers();
    }
    initializeServices() {
        try {
            const config = atlassian_js_1.AtlassianConfigSchema.parse({
                jira: {
                    baseUrl: process.env.JIRA_BASE_URL,
                    email: process.env.JIRA_EMAIL,
                    apiToken: process.env.JIRA_API_TOKEN,
                },
                confluence: {
                    baseUrl: process.env.CONFLUENCE_BASE_URL,
                    email: process.env.CONFLUENCE_EMAIL,
                    apiToken: process.env.CONFLUENCE_API_TOKEN,
                },
            });
            this.jiraService = new jira_js_1.JiraService(config.jira.baseUrl, config.jira.email, config.jira.apiToken);
            this.confluenceService = new confluence_js_1.ConfluenceService(config.confluence.baseUrl, config.confluence.email, config.confluence.apiToken);
        }
        catch (error) {
            console.error('Failed to initialize Atlassian services:', error);
            process.exit(1);
        }
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: this.getAvailableTools(),
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'search_jira_tickets':
                        return await this.handleSearchJiraTickets(args);
                    case 'get_jira_tickets_by_assignee':
                        return await this.handleGetJiraTicketsByAssignee(args);
                    case 'get_jira_tickets_by_creator':
                        return await this.handleGetJiraTicketsByCreator(args);
                    case 'get_jira_tickets_in_timeframe':
                        return await this.handleGetJiraTicketsInTimeframe(args);
                    case 'search_confluence_pages':
                        return await this.handleSearchConfluencePages(args);
                    case 'get_confluence_page_links':
                        return await this.handleGetConfluencePageLinks(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${errorMessage}`,
                        },
                    ],
                };
            }
        });
    }
    getAvailableTools() {
        return [
            {
                name: 'search_jira_tickets',
                description: 'Search for Jira tickets with various filters',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assignee: {
                            type: 'string',
                            description: 'Email of the assignee',
                        },
                        creator: {
                            type: 'string',
                            description: 'Email of the creator',
                        },
                        createdAfter: {
                            type: 'string',
                            description: 'ISO date string for tickets created after this date',
                        },
                        createdBefore: {
                            type: 'string',
                            description: 'ISO date string for tickets created before this date',
                        },
                        project: {
                            type: 'string',
                            description: 'Project key',
                        },
                        status: {
                            type: 'string',
                            description: 'Ticket status',
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results (1-100)',
                            default: 50,
                        },
                        startAt: {
                            type: 'number',
                            description: 'Starting index for pagination',
                            default: 0,
                        },
                    },
                },
            },
            {
                name: 'get_jira_tickets_by_assignee',
                description: 'Get Jira tickets assigned to a specific user with optional date filtering',
                inputSchema: {
                    type: 'object',
                    properties: {
                        assigneeEmail: {
                            type: 'string',
                            description: 'Email of the assignee',
                        },
                        createdAfter: {
                            type: 'string',
                            description: 'ISO date string for tickets created after this date',
                        },
                        createdBefore: {
                            type: 'string',
                            description: 'ISO date string for tickets created before this date',
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results',
                            default: 50,
                        },
                    },
                    required: ['assigneeEmail'],
                },
            },
            {
                name: 'get_jira_tickets_by_creator',
                description: 'Get Jira tickets created by a specific user with optional date filtering',
                inputSchema: {
                    type: 'object',
                    properties: {
                        creatorEmail: {
                            type: 'string',
                            description: 'Email of the creator',
                        },
                        createdAfter: {
                            type: 'string',
                            description: 'ISO date string for tickets created after this date',
                        },
                        createdBefore: {
                            type: 'string',
                            description: 'ISO date string for tickets created before this date',
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results',
                            default: 50,
                        },
                    },
                    required: ['creatorEmail'],
                },
            },
            {
                name: 'get_jira_tickets_in_timeframe',
                description: 'Get Jira tickets created within a specific time frame',
                inputSchema: {
                    type: 'object',
                    properties: {
                        startDate: {
                            type: 'string',
                            description: 'ISO date string for the start of the time frame',
                        },
                        endDate: {
                            type: 'string',
                            description: 'ISO date string for the end of the time frame',
                        },
                        maxResults: {
                            type: 'number',
                            description: 'Maximum number of results',
                            default: 50,
                        },
                    },
                    required: ['startDate', 'endDate'],
                },
            },
            {
                name: 'search_confluence_pages',
                description: 'Search for Confluence pages based on text query',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Text to search for in pages',
                        },
                        spaceKey: {
                            type: 'string',
                            description: 'Space key to limit search to specific space',
                        },
                        type: {
                            type: 'string',
                            enum: ['page', 'blogpost'],
                            description: 'Type of content to search for',
                            default: 'page',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results',
                            default: 25,
                        },
                        start: {
                            type: 'number',
                            description: 'Starting index for pagination',
                            default: 0,
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'get_confluence_page_links',
                description: 'Get links to Confluence pages based on a search query',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Text to search for in pages',
                        },
                        spaceKey: {
                            type: 'string',
                            description: 'Space key to limit search to specific space',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of results',
                            default: 25,
                        },
                    },
                    required: ['query'],
                },
            },
        ];
    }
    async handleSearchJiraTickets(args) {
        const options = atlassian_js_2.JiraSearchOptionsSchema.parse(args);
        const result = await this.jiraService.searchTickets(options);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async handleGetJiraTicketsByAssignee(args) {
        const { assigneeEmail, createdAfter, createdBefore, maxResults } = args;
        const result = await this.jiraService.getTicketsByAssignee(assigneeEmail, createdAfter, createdBefore, maxResults);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async handleGetJiraTicketsByCreator(args) {
        const { creatorEmail, createdAfter, createdBefore, maxResults } = args;
        const result = await this.jiraService.getTicketsByCreator(creatorEmail, createdAfter, createdBefore, maxResults);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async handleGetJiraTicketsInTimeframe(args) {
        const { startDate, endDate, maxResults } = args;
        const result = await this.jiraService.getTicketsInTimeframe(startDate, endDate, maxResults);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async handleSearchConfluencePages(args) {
        const options = atlassian_js_2.ConfluenceSearchOptionsSchema.parse(args);
        const result = await this.confluenceService.searchPages(options);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async handleGetConfluencePageLinks(args) {
        const { query, spaceKey, limit } = args;
        const links = await this.confluenceService.getPageLinks(query, spaceKey, limit);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ links }, null, 2),
                },
            ],
        };
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('Atlassian MCP Server running on stdio');
    }
}
exports.AtlassianMCPServer = AtlassianMCPServer;
// Start the server
if (require.main === module) {
    const server = new AtlassianMCPServer();
    server.run().catch(console.error);
}
//# sourceMappingURL=index.js.map