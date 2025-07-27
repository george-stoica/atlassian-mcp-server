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
exports.JiraService = void 0;
var axios_1 = require("axios");
var atlassian_1 = require("../schemas/atlassian");
var JiraService = /** @class */ (function () {
    function JiraService(baseUrl, email, apiToken) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.client = axios_1.default.create({
            baseURL: "".concat(this.baseUrl, "/rest/api/3"),
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
     * Search for Jira tickets based on the provided options
     */
    JiraService.prototype.searchTickets = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedOptions, jqlParts, jql, response, result, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        validatedOptions = atlassian_1.JiraSearchOptionsSchema.parse(options);
                        jqlParts = [];
                        if (validatedOptions.assignee) {
                            jqlParts.push("assignee = \"".concat(validatedOptions.assignee, "\""));
                        }
                        if (validatedOptions.creator) {
                            jqlParts.push("creator = \"".concat(validatedOptions.creator, "\""));
                        }
                        if (validatedOptions.project) {
                            jqlParts.push("project = \"".concat(validatedOptions.project, "\""));
                        }
                        if (validatedOptions.status) {
                            jqlParts.push("status = \"".concat(validatedOptions.status, "\""));
                        }
                        if (validatedOptions.createdAfter) {
                            jqlParts.push("created >= \"".concat(validatedOptions.createdAfter, "\""));
                        }
                        if (validatedOptions.createdBefore) {
                            jqlParts.push("created <= \"".concat(validatedOptions.createdBefore, "\""));
                        }
                        jql = jqlParts.length > 0 ? jqlParts.join(' AND ') : 'order by created DESC';
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/search', {
                                jql: jql,
                                startAt: validatedOptions.startAt,
                                maxResults: validatedOptions.maxResults,
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
                            })];
                    case 2:
                        response = _e.sent();
                        result = atlassian_1.JiraSearchResultSchema.parse(response.data);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _e.sent();
                        if (axios_1.default.isAxiosError(error_1)) {
                            throw new Error("Jira API error: ".concat((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status, " - ").concat(((_d = (_c = (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errorMessages) === null || _d === void 0 ? void 0 : _d.join(', ')) || error_1.message));
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get tickets by assignee with optional date filtering
     */
    JiraService.prototype.getTicketsByAssignee = function (assigneeEmail_1, createdAfter_1, createdBefore_1) {
        return __awaiter(this, arguments, void 0, function (assigneeEmail, createdAfter, createdBefore, maxResults) {
            if (maxResults === void 0) { maxResults = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchTickets({
                        assignee: assigneeEmail,
                        createdAfter: createdAfter,
                        createdBefore: createdBefore,
                        maxResults: maxResults,
                    })];
            });
        });
    };
    /**
     * Get tickets by creator with optional date filtering
     */
    JiraService.prototype.getTicketsByCreator = function (creatorEmail_1, createdAfter_1, createdBefore_1) {
        return __awaiter(this, arguments, void 0, function (creatorEmail, createdAfter, createdBefore, maxResults) {
            if (maxResults === void 0) { maxResults = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchTickets({
                        creator: creatorEmail,
                        createdAfter: createdAfter,
                        createdBefore: createdBefore,
                        maxResults: maxResults,
                    })];
            });
        });
    };
    /**
     * Get tickets created within a specific time frame
     */
    JiraService.prototype.getTicketsInTimeframe = function (startDate_1, endDate_1) {
        return __awaiter(this, arguments, void 0, function (startDate, endDate, maxResults) {
            if (maxResults === void 0) { maxResults = 50; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.searchTickets({
                        createdAfter: startDate,
                        createdBefore: endDate,
                        maxResults: maxResults,
                    })];
            });
        });
    };
    /**
     * Get a specific ticket by key
     */
    JiraService.prototype.getTicketByKey = function (ticketKey) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get("/issue/".concat(ticketKey), {
                                params: {
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
                                    ].join(','),
                                    expand: 'renderedFields',
                                },
                            })];
                    case 1:
                        response = _e.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _e.sent();
                        if (axios_1.default.isAxiosError(error_2)) {
                            throw new Error("Jira API error: ".concat((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.status, " - ").concat(((_d = (_c = (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errorMessages) === null || _d === void 0 ? void 0 : _d.join(', ')) || error_2.message));
                        }
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Test the connection to Jira
     */
    JiraService.prototype.testConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get('/myself')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return JiraService;
}());
exports.JiraService = JiraService;
