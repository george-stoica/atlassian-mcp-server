"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var confluence_1 = require("../services/confluence");
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
describe('ConfluenceService', function () {
    var confluenceService;
    var mockBaseUrl = 'https://test.atlassian.net';
    var mockEmail = 'test@example.com';
    var mockApiToken = 'test-token';
    // Mock response data
    var mockConfluencePage = {
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
    var mockSearchResult = {
        results: [mockConfluencePage],
        start: 0,
        limit: 25,
        size: 1,
        _links: {
            base: 'https://test.atlassian.net/wiki',
            context: '',
            self: 'https://test.atlassian.net/wiki/api/v2/pages'
        }
    };
    beforeEach(function () {
        jest.clearAllMocks();
        // Mock axios.create to return a mock instance
        var mockAxiosInstance = {
            get: jest.fn(),
            post: jest.fn(),
        };
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        confluenceService = new confluence_1.ConfluenceService(mockBaseUrl, mockEmail, mockApiToken);
    });
    describe('constructor', function () {
        it('should create axios instance with correct configuration', function () {
            expect(mockedAxios.create).toHaveBeenCalledWith({
                baseURL: "".concat(mockBaseUrl, "/wiki/api/v2"),
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
            new confluence_1.ConfluenceService("".concat(mockBaseUrl, "/"), mockEmail, mockApiToken);
            expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
                baseURL: "".concat(mockBaseUrl, "/wiki/api/v2"),
            }));
        });
    });
    describe('searchPages', function () {
        it('should search pages with basic query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        options = {
                            query: 'test search',
                            limit: 25,
                            start: 0
                        };
                        return [4 /*yield*/, confluenceService.searchPages(options)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "test search" AND type = "page"',
                                limit: 25,
                                start: 0,
                            },
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search pages with space filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        options = {
                            query: 'test search',
                            spaceKey: 'TEST',
                            type: 'page',
                            limit: 25,
                            start: 0
                        };
                        return [4 /*yield*/, confluenceService.searchPages(options)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "test search" AND space.key = "TEST" AND type = "page"',
                                limit: 25,
                                start: 0,
                            },
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search for blog posts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        options = {
                            query: 'blog post search',
                            type: 'blogpost',
                            limit: 10,
                            start: 0
                        };
                        return [4 /*yield*/, confluenceService.searchPages(options)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "blog post search" AND type = "blogpost"',
                                limit: 10,
                                start: 0,
                            },
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
                                    message: 'Invalid CQL query'
                                }
                            }
                        };
                        mockAxiosInstance.get.mockRejectedValue(errorResponse);
                        return [4 /*yield*/, expect(confluenceService.searchPages({
                                query: 'test',
                                type: 'page'
                            })).rejects.toThrow('Confluence API error: 400 - Invalid CQL query')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate input parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Test with empty query
                    return [4 /*yield*/, expect(confluenceService.searchPages({
                            query: '',
                            type: 'page'
                        })).rejects.toThrow()];
                    case 1:
                        // Test with empty query
                        _a.sent();
                        // Test with invalid limit
                        return [4 /*yield*/, expect(confluenceService.searchPages({
                                query: 'test',
                                type: 'page',
                                limit: 101
                            })).rejects.toThrow()];
                    case 2:
                        // Test with invalid limit
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('searchPagesByText', function () {
        it('should search pages by text query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.searchPagesByText('test query')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "test query" AND type = "page"',
                                limit: 25,
                                start: 0,
                            },
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search pages by text query with space filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.searchPagesByText('test query', 'TEST')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "test query" AND space.key = "TEST" AND type = "page"',
                                limit: 25,
                                start: 0,
                            },
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPagesBySpace', function () {
        it('should get pages by space key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.getPagesBySpace('TEST')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                'space-key': 'TEST',
                                limit: 25,
                                start: 0,
                            },
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get pages by space key with custom limit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.getPagesBySpace('TEST', 50)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                'space-key': 'TEST',
                                limit: 50,
                                start: 0,
                            },
                        });
                        expect(result).toEqual(mockSearchResult);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPageById', function () {
        it('should get page by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockConfluencePage });
                        return [4 /*yield*/, confluenceService.getPageById('123456')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages/123456');
                        expect(result).toEqual(mockConfluencePage);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, errorResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        errorResponse = {
                            response: {
                                status: 404,
                                data: {
                                    message: 'Page not found'
                                }
                            }
                        };
                        mockAxiosInstance.get.mockRejectedValue(errorResponse);
                        return [4 /*yield*/, expect(confluenceService.getPageById('nonexistent')).rejects.toThrow('Confluence API error: 404 - Page not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getPageLinks', function () {
        it('should get page links for search query', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.getPageLinks('test query')];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "test query" AND type = "page"',
                                limit: 25,
                                start: 0,
                            },
                        });
                        expect(result).toEqual([
                            "".concat(mockBaseUrl).concat(mockConfluencePage._links.webui)
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get page links with space filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.getPageLinks('test query', 'TEST', 10)];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
                            params: {
                                cql: 'text ~ "test query" AND space.key = "TEST" AND type = "page"',
                                limit: 10,
                                start: 0,
                            },
                        });
                        expect(result).toEqual([
                            "".concat(mockBaseUrl).concat(mockConfluencePage._links.webui)
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return empty array when no pages found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockAxiosInstance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockAxiosInstance = mockedAxios.create();
                        mockAxiosInstance.get.mockResolvedValue({
                            data: __assign(__assign({}, mockSearchResult), { results: [], size: 0 })
                        });
                        return [4 /*yield*/, confluenceService.getPageLinks('nonexistent query')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([]);
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
                        mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });
                        return [4 /*yield*/, confluenceService.testConnection()];
                    case 1:
                        result = _a.sent();
                        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', { params: { limit: 1 } });
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
                        return [4 /*yield*/, confluenceService.testConnection()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('buildCQLQuery', function () {
        it('should build CQL query with all conditions', function () {
            var confluenceServiceAny = confluenceService;
            var query = confluenceServiceAny.buildCQLQuery({
                query: 'test search',
                spaceKey: 'TEST',
                type: 'page'
            });
            expect(query).toBe('text ~ "test search" AND space.key = "TEST" AND type = "page"');
        });
        it('should build CQL query without space key', function () {
            var confluenceServiceAny = confluenceService;
            var query = confluenceServiceAny.buildCQLQuery({
                query: 'test search',
                type: 'blogpost'
            });
            expect(query).toBe('text ~ "test search" AND type = "blogpost"');
        });
        it('should handle empty query text', function () {
            var confluenceServiceAny = confluenceService;
            var query = confluenceServiceAny.buildCQLQuery({
                query: '   ',
                type: 'page'
            });
            expect(query).toBe('type = "page"');
        });
    });
});
