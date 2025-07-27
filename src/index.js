#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlassianMCPServer = void 0;
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var dotenv = require("dotenv");
var jira_js_1 = require("./services/jira.js");
var confluence_js_1 = require("./services/confluence.js");
var atlassian_js_1 = require("./schemas/atlassian.js");
var atlassian_js_2 = require("./schemas/atlassian.js");
// Load environment variables
dotenv.config();
var AtlassianMCPServer = /** @class */ (function () {
    function AtlassianMCPServer() {
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
    AtlassianMCPServer.prototype.initializeServices = function () {
        try {
            var config = atlassian_js_1.AtlassianConfigSchema.parse({
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
    };
    AtlassianMCPServer.prototype.setupHandlers = function () {
        var _this = this;
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        tools: this.getAvailableTools(),
                    }];
            });
        }); });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, args, _b, error_1, errorMessage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = request.params, name = _a.name, args = _a.arguments;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 16, , 17]);
                        _b = name;
                        switch (_b) {
                            case 'search_jira_tickets': return [3 /*break*/, 2];
                            case 'get_jira_tickets_by_assignee': return [3 /*break*/, 4];
                            case 'get_jira_tickets_by_creator': return [3 /*break*/, 6];
                            case 'get_jira_tickets_in_timeframe': return [3 /*break*/, 8];
                            case 'search_confluence_pages': return [3 /*break*/, 10];
                            case 'get_confluence_page_links': return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 14];
                    case 2: return [4 /*yield*/, this.handleSearchJiraTickets(args)];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [4 /*yield*/, this.handleGetJiraTicketsByAssignee(args)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [4 /*yield*/, this.handleGetJiraTicketsByCreator(args)];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8: return [4 /*yield*/, this.handleGetJiraTicketsInTimeframe(args)];
                    case 9: return [2 /*return*/, _c.sent()];
                    case 10: return [4 /*yield*/, this.handleSearchConfluencePages(args)];
                    case 11: return [2 /*return*/, _c.sent()];
                    case 12: return [4 /*yield*/, this.handleGetConfluencePageLinks(args)];
                    case 13: return [2 /*return*/, _c.sent()];
                    case 14: throw new Error("Unknown tool: ".concat(name));
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_1 = _c.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : 'Unknown error';
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "Error: ".concat(errorMessage),
                                    },
                                ],
                            }];
                    case 17: return [2 /*return*/];
                }
            });
        }); });
    };
    AtlassianMCPServer.prototype.getAvailableTools = function () {
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
    };
    AtlassianMCPServer.prototype.handleSearchJiraTickets = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = atlassian_js_2.JiraSearchOptionsSchema.parse(args);
                        return [4 /*yield*/, this.jiraService.searchTickets(options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify(result, null, 2),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    AtlassianMCPServer.prototype.handleGetJiraTicketsByAssignee = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var assigneeEmail, createdAfter, createdBefore, maxResults, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assigneeEmail = args.assigneeEmail, createdAfter = args.createdAfter, createdBefore = args.createdBefore, maxResults = args.maxResults;
                        return [4 /*yield*/, this.jiraService.getTicketsByAssignee(assigneeEmail, createdAfter, createdBefore, maxResults)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify(result, null, 2),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    AtlassianMCPServer.prototype.handleGetJiraTicketsByCreator = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var creatorEmail, createdAfter, createdBefore, maxResults, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        creatorEmail = args.creatorEmail, createdAfter = args.createdAfter, createdBefore = args.createdBefore, maxResults = args.maxResults;
                        return [4 /*yield*/, this.jiraService.getTicketsByCreator(creatorEmail, createdAfter, createdBefore, maxResults)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify(result, null, 2),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    AtlassianMCPServer.prototype.handleGetJiraTicketsInTimeframe = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, maxResults, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = args.startDate, endDate = args.endDate, maxResults = args.maxResults;
                        return [4 /*yield*/, this.jiraService.getTicketsInTimeframe(startDate, endDate, maxResults)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify(result, null, 2),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    AtlassianMCPServer.prototype.handleSearchConfluencePages = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = atlassian_js_2.ConfluenceSearchOptionsSchema.parse(args);
                        return [4 /*yield*/, this.confluenceService.searchPages(options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify(result, null, 2),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    AtlassianMCPServer.prototype.handleGetConfluencePageLinks = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var query, spaceKey, limit, links;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = args.query, spaceKey = args.spaceKey, limit = args.limit;
                        return [4 /*yield*/, this.confluenceService.getPageLinks(query, spaceKey, limit)];
                    case 1:
                        links = _a.sent();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: JSON.stringify({ links: links }, null, 2),
                                    },
                                ],
                            }];
                }
            });
        });
    };
    AtlassianMCPServer.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transport;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transport = new stdio_js_1.StdioServerTransport();
                        return [4 /*yield*/, this.server.connect(transport)];
                    case 1:
                        _a.sent();
                        console.error('Atlassian MCP Server running on stdio');
                        return [2 /*return*/];
                }
            });
        });
    };
    return AtlassianMCPServer;
}());
exports.AtlassianMCPServer = AtlassianMCPServer;
// Start the server
if (require.main === module) {
    var server = new AtlassianMCPServer();
    server.run().catch(console.error);
}
