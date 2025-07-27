"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var atlassian_1 = require("../schemas/atlassian");
describe('Atlassian Schemas', function () {
    describe('JiraSearchOptionsSchema', function () {
        it('should validate valid search options', function () {
            var validOptions = {
                assignee: 'john.doe@example.com',
                creator: 'jane.smith@example.com',
                createdAfter: '2024-01-01T00:00:00.000Z',
                createdBefore: '2024-01-31T23:59:59.999Z',
                project: 'TEST',
                status: 'In Progress',
                maxResults: 25,
                startAt: 0,
            };
            var result = atlassian_1.JiraSearchOptionsSchema.parse(validOptions);
            expect(result).toEqual(validOptions);
        });
        it('should apply default values', function () {
            var minimalOptions = {};
            var result = atlassian_1.JiraSearchOptionsSchema.parse(minimalOptions);
            expect(result.maxResults).toBe(50);
            expect(result.startAt).toBe(0);
        });
        it('should validate maxResults range', function () {
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ maxResults: 0 });
            }).toThrow();
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ maxResults: 101 });
            }).toThrow();
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ maxResults: 50 });
            }).not.toThrow();
        });
        it('should validate startAt minimum value', function () {
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ startAt: -1 });
            }).toThrow();
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ startAt: 0 });
            }).not.toThrow();
        });
        it('should validate datetime format', function () {
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ createdAfter: 'invalid-date' });
            }).toThrow();
            expect(function () {
                atlassian_1.JiraSearchOptionsSchema.parse({ createdAfter: '2024-01-01T00:00:00.000Z' });
            }).not.toThrow();
        });
    });
    describe('ConfluenceSearchOptionsSchema', function () {
        it('should validate valid search options', function () {
            var validOptions = {
                query: 'test search',
                spaceKey: 'TEST',
                type: 'page',
                limit: 25,
                start: 0,
            };
            var result = atlassian_1.ConfluenceSearchOptionsSchema.parse(validOptions);
            expect(result).toEqual(validOptions);
        });
        it('should apply default values', function () {
            var minimalOptions = {
                query: 'test search',
            };
            var result = atlassian_1.ConfluenceSearchOptionsSchema.parse(minimalOptions);
            expect(result.type).toBe('page');
            expect(result.limit).toBe(25);
            expect(result.start).toBe(0);
        });
        it('should require query field', function () {
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({});
            }).toThrow();
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({ query: '' });
            }).toThrow();
        });
        it('should validate type enum', function () {
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    type: 'invalid-type'
                });
            }).toThrow();
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    type: 'page'
                });
            }).not.toThrow();
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    type: 'blogpost'
                });
            }).not.toThrow();
        });
        it('should validate limit range', function () {
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    limit: 0
                });
            }).toThrow();
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    limit: 101
                });
            }).toThrow();
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    limit: 50
                });
            }).not.toThrow();
        });
        it('should validate start minimum value', function () {
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    start: -1
                });
            }).toThrow();
            expect(function () {
                atlassian_1.ConfluenceSearchOptionsSchema.parse({
                    query: 'test',
                    start: 0
                });
            }).not.toThrow();
        });
    });
    describe('AtlassianConfigSchema', function () {
        it('should validate valid configuration', function () {
            var validConfig = {
                jira: {
                    baseUrl: 'https://test.atlassian.net',
                    email: 'test@example.com',
                    apiToken: 'test-token-123',
                },
                confluence: {
                    baseUrl: 'https://test.atlassian.net',
                    email: 'test@example.com',
                    apiToken: 'test-token-456',
                },
            };
            var result = atlassian_1.AtlassianConfigSchema.parse(validConfig);
            expect(result).toEqual(validConfig);
        });
        it('should require all fields', function () {
            expect(function () {
                atlassian_1.AtlassianConfigSchema.parse({});
            }).toThrow();
            expect(function () {
                atlassian_1.AtlassianConfigSchema.parse({
                    jira: {
                        baseUrl: 'https://test.atlassian.net',
                        email: 'test@example.com',
                        // Missing apiToken
                    },
                });
            }).toThrow();
        });
        it('should validate URL format', function () {
            expect(function () {
                atlassian_1.AtlassianConfigSchema.parse({
                    jira: {
                        baseUrl: 'invalid-url',
                        email: 'test@example.com',
                        apiToken: 'test-token',
                    },
                    confluence: {
                        baseUrl: 'https://test.atlassian.net',
                        email: 'test@example.com',
                        apiToken: 'test-token',
                    },
                });
            }).toThrow();
        });
        it('should validate email format', function () {
            expect(function () {
                atlassian_1.AtlassianConfigSchema.parse({
                    jira: {
                        baseUrl: 'https://test.atlassian.net',
                        email: 'invalid-email',
                        apiToken: 'test-token',
                    },
                    confluence: {
                        baseUrl: 'https://test.atlassian.net',
                        email: 'test@example.com',
                        apiToken: 'test-token',
                    },
                });
            }).toThrow();
        });
        it('should validate non-empty API token', function () {
            expect(function () {
                atlassian_1.AtlassianConfigSchema.parse({
                    jira: {
                        baseUrl: 'https://test.atlassian.net',
                        email: 'test@example.com',
                        apiToken: '',
                    },
                    confluence: {
                        baseUrl: 'https://test.atlassian.net',
                        email: 'test@example.com',
                        apiToken: 'test-token',
                    },
                });
            }).toThrow();
        });
    });
    describe('JiraTicketSchema', function () {
        it('should validate valid Jira ticket', function () {
            var validTicket = {
                id: '12345',
                key: 'TEST-123',
                self: 'https://test.atlassian.net/rest/api/3/issue/12345',
                fields: {
                    summary: 'Test ticket summary',
                    description: 'Test ticket description',
                    status: {
                        name: 'In Progress',
                        statusCategory: {
                            key: 'indeterminate',
                            name: 'In Progress'
                        }
                    },
                    assignee: {
                        accountId: 'user-123',
                        displayName: 'John Doe',
                        emailAddress: 'john.doe@example.com'
                    },
                    creator: {
                        accountId: 'user-456',
                        displayName: 'Jane Smith',
                        emailAddress: 'jane.smith@example.com'
                    },
                    reporter: {
                        accountId: 'user-456',
                        displayName: 'Jane Smith',
                        emailAddress: 'jane.smith@example.com'
                    },
                    created: '2024-01-01T10:00:00.000Z',
                    updated: '2024-01-02T10:00:00.000Z',
                    priority: {
                        name: 'High',
                        id: '2'
                    },
                    issuetype: {
                        name: 'Bug',
                        id: '1'
                    },
                    project: {
                        key: 'TEST',
                        name: 'Test Project',
                        id: '10001'
                    }
                }
            };
            var result = atlassian_1.JiraTicketSchema.parse(validTicket);
            expect(result).toEqual(validTicket);
        });
        it('should allow optional assignee', function () {
            var ticketWithoutAssignee = {
                id: '12345',
                key: 'TEST-123',
                self: 'https://test.atlassian.net/rest/api/3/issue/12345',
                fields: {
                    summary: 'Test ticket summary',
                    status: {
                        name: 'Open',
                        statusCategory: {
                            key: 'new',
                            name: 'To Do'
                        }
                    },
                    creator: {
                        accountId: 'user-456',
                        displayName: 'Jane Smith',
                        emailAddress: 'jane.smith@example.com'
                    },
                    reporter: {
                        accountId: 'user-456',
                        displayName: 'Jane Smith',
                        emailAddress: 'jane.smith@example.com'
                    },
                    created: '2024-01-01T10:00:00.000Z',
                    updated: '2024-01-02T10:00:00.000Z',
                    priority: {
                        name: 'Medium',
                        id: '3'
                    },
                    issuetype: {
                        name: 'Task',
                        id: '2'
                    },
                    project: {
                        key: 'TEST',
                        name: 'Test Project',
                        id: '10001'
                    }
                }
            };
            expect(function () {
                atlassian_1.JiraTicketSchema.parse(ticketWithoutAssignee);
            }).not.toThrow();
        });
        it('should require all mandatory fields', function () {
            expect(function () {
                atlassian_1.JiraTicketSchema.parse({
                    id: '12345',
                    key: 'TEST-123',
                    // Missing self and fields
                });
            }).toThrow();
        });
    });
    describe('ConfluencePageSchema', function () {
        it('should validate valid Confluence page', function () {
            var validPage = {
                id: '123456',
                type: 'page',
                status: 'current',
                title: 'Test Page Title',
                space: {
                    id: '98765',
                    key: 'TEST',
                    name: 'Test Space'
                },
                version: {
                    number: 1,
                    when: '2024-01-01T10:00:00.000Z',
                    by: {
                        type: 'known',
                        accountId: 'user-123',
                        displayName: 'John Doe'
                    }
                },
                _links: {
                    webui: '/spaces/TEST/pages/123456/Test+Page+Title',
                    self: 'https://test.atlassian.net/wiki/api/v2/pages/123456'
                },
                _expandable: {
                    container: '',
                    metadata: '',
                    operations: '',
                    children: '',
                    restrictions: '',
                    history: '',
                    ancestors: '',
                    body: '',
                    descendants: ''
                }
            };
            var result = atlassian_1.ConfluencePageSchema.parse(validPage);
            expect(result).toEqual(validPage);
        });
        it('should allow optional _expandable field', function () {
            var pageWithoutExpandable = {
                id: '123456',
                type: 'page',
                status: 'current',
                title: 'Test Page Title',
                space: {
                    id: '98765',
                    key: 'TEST',
                    name: 'Test Space'
                },
                version: {
                    number: 1,
                    when: '2024-01-01T10:00:00.000Z',
                    by: {
                        type: 'known',
                        accountId: 'user-123',
                        displayName: 'John Doe'
                    }
                },
                _links: {
                    webui: '/spaces/TEST/pages/123456/Test+Page+Title',
                    self: 'https://test.atlassian.net/wiki/api/v2/pages/123456'
                }
            };
            expect(function () {
                atlassian_1.ConfluencePageSchema.parse(pageWithoutExpandable);
            }).not.toThrow();
        });
        it('should require all mandatory fields', function () {
            expect(function () {
                atlassian_1.ConfluencePageSchema.parse({
                    id: '123456',
                    type: 'page',
                    // Missing other required fields
                });
            }).toThrow();
        });
    });
});
