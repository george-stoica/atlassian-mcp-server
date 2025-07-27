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
var jira_1 = require("../services/jira");
var axios_1 = require("axios");
// Mock axios
jest.mock('axios');
var mockedAxios = axios_1.default;
// Mock axios.isAxiosError
Object.defineProperty(axios_1.default, 'isAxiosError', {
    value: jest.fn(function (error) {
        return error && error.response !== undefined;
    })
});
describe('JiraService', function () {
    var jiraService;
    var mockBaseUrl = 'https://test.atlassian.net';
    var mockEmail = 'test@example.com';
    var mockApiToken = 'test-token';
    // Mock response data
    var mockJiraTicket = {
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
    var mockSearchResult = {
        expand: 'schema,names',
        startAt: 0,
        maxResults: 50,
        total: 1,
        issues: [mockJiraTicket]
    };
    beforeEach(function () {
        jest.clearAllMocks();
        // Mock axios.create to return a mock instance
        var mockAxiosInstance = {
            post: jest.fn(),
            get: jest.fn(),
        };
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        jiraService = new jira_1.JiraService(mockBaseUrl, mockEmail, mockApiToken);
    });
    describe('constructor', function () {
        it('should create axios instance with correct configuration', function () {
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: "".concat(mockBaseUrl, "/rest/api/3"),
                auth: {
                    username: mockEmail,
                    password: mockApiToken,
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
        });
        it('should remove trailing slash from baseUrl', function () {
            new jira_1.JiraService("".concat(mockBaseUrl, "/"), mockEmail, mockApiToken);
            expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
                baseURL: "".concat(mockBaseUrl, "/rest/api/3"),
            }));
        });
    });
    describe('searchTickets', function () {
        it('should search tickets with basic options', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        options = {
                            assignee: 'john.doe@example.com',
                            maxResults: 25
                        };
                        return [4 /*yield*/, jiraService.searchTickets(options)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'assignee = "john.doe@example.com"',
                            startAt: 0,
                            maxResults: 25,
                            fields: [
                                'summary',
                                'description',
                                'status',
                                'assignee',
                                'creator',
                                'reporter',
                                'created',
                                'updated',
                                'priority',
                                'issuetype',
                                'project',
                            ],
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search tickets with date range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        options = {
                            createdAfter: '2024-01-01T00:00:00.000Z',
                            createdBefore: '2024-01-31T23:59:59.999Z',
                            maxResults: 50
                        };
                        return [4 /*yield*/, jiraService.searchTickets(options)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'created >= "2024-01-01T00:00:00.000Z" AND created <= "2024-01-31T23:59:59.999Z"',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search tickets with multiple filters', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        options = {
                            assignee: 'john.doe@example.com',
                            project: 'TEST',
                            status: 'In Progress',
                            createdAfter: '2024-01-01T00:00:00.000Z'
                        };
                        return [4 /*yield*/, jiraService.searchTickets(options)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'assignee = "john.doe@example.com" AND project = "TEST" AND status = "In Progress" AND created >= "2024-01-01T00:00:00.000Z"',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle empty search options', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, jiraService.searchTickets({})];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'order by created DESC',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error on API failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, errorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        errorResponse = {
                            response: {
                                status: 400,
                                data: {
                                    errorMessages: ['Invalid JQL query']
                                }
                            }
                        };
                        mockAxiosInstance.post.mockRejectedValue(errorResponse);
                        return [4 /*yield*/, expect(jiraService.searchTickets({})).rejects.toThrow('Jira API error: 400 - Invalid JQL query')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTicketsByAssignee', function () {
        it('should get tickets by assignee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, jiraService.getTicketsByAssignee('john.doe@example.com')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'assignee = "john.doe@example.com"',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get tickets by assignee with date filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, jiraService.getTicketsByAssignee('john.doe@example.com', '2024-01-01T00:00:00.000Z', '2024-01-31T23:59:59.999Z')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'assignee = "john.doe@example.com" AND created >= "2024-01-01T00:00:00.000Z" AND created <= "2024-01-31T23:59:59.999Z"',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTicketsByCreator', function () {
        it('should get tickets by creator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, jiraService.getTicketsByCreator('jane.smith@example.com')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'creator = "jane.smith@example.com"',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTicketsInTimeframe', function () {
        it('should get tickets in timeframe', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, jiraService.getTicketsInTimeframe('2024-01-01T00:00:00.000Z', '2024-01-31T23:59:59.999Z')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
                            jql: 'created >= "2024-01-01T00:00:00.000Z" AND created <= "2024-01-31T23:59:59.999Z"',
                            startAt: 0,
                            maxResults: 50,
                            fields: expect.any(Array),
                            expand: ['renderedFields'],
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTicketByKey', function () {
        it('should get ticket by key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockJiraTicket });
                        return [4 /*yield*/, jiraService.getTicketByKey('TEST-123')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-123', {
                            params: {
                                fields: 'summary,description,status,assignee,creator,reporter,created,updated,priority,issuetype,project',
                                expand: 'renderedFields',
                            },
                        });
                        expect(result).toEqual(mockJiraTicket);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent ticket', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, errorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        errorResponse = {
                            response: {
                                status: 404,
                                data: {
                                    errorMessages: ['Issue does not exist or you do not have permission to see it.']
                                }
                            }
                        };
                        mockAxiosInstance.get.mockRejectedValue(errorResponse);
                        return [4 /*yield*/, expect(jiraService.getTicketByKey('NONEXISTENT-123')).rejects.toThrow('Jira API error: 404')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('testConnection', function () {
        it('should return true for successful connection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: {} });
                        return [4 /*yield*/, jiraService.testConnection()];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/myself');
                        expect(result).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return false for failed connection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));
                        return [4 /*yield*/, jiraService.testConnection()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
