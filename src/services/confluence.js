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
exports.ConfluenceService = void 0;
var axios_1 = require("axios");
var atlassian_1 = require("../schemas/atlassian");
var ConfluenceService = /** @class */ (function () {
    function ConfluenceService(baseUrl, email, apiToken) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.client = axios_1.default.create({
            baseURL: "".concat(this.baseUrl, "/wiki/api/v2"),
            auth: {
                username: email,
                password: apiToken,
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 seconds timeout
        });
    }
    /**
     * Search for Confluence pages based on the provided options
     */
    ConfluenceService.prototype.searchPages = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedOptions, params, response, result, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        validatedOptions = atlassian_1.ConfluenceSearchOptionsSchema.parse(options);
                        params = {
                            cql: this.buildCQLQuery(validatedOptions),
                            limit: validatedOptions.limit,
                            start: validatedOptions.start,
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.get('/pages', { params: params })];
                    case 2:
                        response = _d.sent();
                        result = atlassian_1.ConfluenceSearchResultSchema.parse(response.data);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _d.sent();
                        if (axios_1.default.isAxiosError(error_1)) {
                            throw new Error("Confluence API error: ".concat((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status, " - ").concat(((_c = (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error_1.message));
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search for pages by text query
     */
    ConfluenceService.prototype.searchPagesByText = function (query_1, spaceKey_1) {
        return __awaiter(this, arguments, void 0, function (query, spaceKey, limit) {
            if (limit === void 0) { limit = 25; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchPages({
                        query: query,
                        spaceKey: spaceKey,
                        type: 'page',
                        limit: limit,
                    })];
            });
        });
    };
    /**
     * Get pages from a specific space
     */
    ConfluenceService.prototype.getPagesBySpace = function (spaceKey_1) {
        return __awaiter(this, arguments, void 0, function (spaceKey, limit) {
            var params, response, result, error_2;
            var _a, _b, _c;
            if (limit === void 0) { limit = 25; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        params = {
                            'space-key': spaceKey,
                            limit: limit,
                            start: 0,
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.get('/pages', { params: params })];
                    case 2:
                        response = _d.sent();
                        result = atlassian_1.ConfluenceSearchResultSchema.parse(response.data);
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _d.sent();
                        if (axios_1.default.isAxiosError(error_2)) {
                            throw new Error("Confluence API error: ".concat((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.status, " - ").concat(((_c = (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error_2.message));
                        }
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a specific page by ID
     */
    ConfluenceService.prototype.getPageById = function (pageId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get("/pages/".concat(pageId))];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_3 = _d.sent();
                        if (axios_1.default.isAxiosError(error_3)) {
                            throw new Error("Confluence API error: ".concat((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status, " - ").concat(((_c = (_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error_3.message));
                        }
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get page links for pages matching a query
     */
    ConfluenceService.prototype.getPageLinks = function (query_1, spaceKey_1) {
        return __awaiter(this, arguments, void 0, function (query, spaceKey, limit) {
            var searchResult;
            var _this = this;
            if (limit === void 0) { limit = 25; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchPagesByText(query, spaceKey, limit)];
                    case 1:
                        searchResult = _a.sent();
                        return [2 /*return*/, searchResult.results.map(function (page) {
                                // Construct the full URL using the webui link
                                return "".concat(_this.baseUrl).concat(page._links.webui);
                            })];
                }
            });
        });
    };
    /**
     * Test the connection to Confluence
     */
    ConfluenceService.prototype.testConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get('/pages', { params: { limit: 1 } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Build CQL (Confluence Query Language) query from search options
     */
    ConfluenceService.prototype.buildCQLQuery = function (options) {
        var conditions = [];
        // Add text search condition
        if (options.query.trim()) {
            conditions.push("text ~ \"".concat(options.query.trim(), "\""));
        }
        // Add space filter if specified
        if (options.spaceKey) {
            conditions.push("space.key = \"".concat(options.spaceKey, "\""));
        }
        // Add type filter
        conditions.push("type = \"".concat(options.type, "\""));
        return conditions.join(' AND ');
    };
    return ConfluenceService;
}());
exports.ConfluenceService = ConfluenceService;
