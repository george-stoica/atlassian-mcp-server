"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraService = void 0;
const axios_1 = __importDefault(require("axios"));
const atlassian_1 = require("../schemas/atlassian");
class JiraService {
    constructor(baseUrl, email, apiToken) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.client = axios_1.default.create({
            baseURL: `${this.baseUrl}/rest/api/3`,
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
    async searchTickets(options) {
        // Validate input
        const validatedOptions = atlassian_1.JiraSearchOptionsSchema.parse(options);
        // Build JQL query
        const jqlParts = [];
        if (validatedOptions.assignee) {
            jqlParts.push(`assignee = "${validatedOptions.assignee}"`);
        }
        if (validatedOptions.creator) {
            jqlParts.push(`creator = "${validatedOptions.creator}"`);
        }
        if (validatedOptions.project) {
            jqlParts.push(`project = "${validatedOptions.project}"`);
        }
        if (validatedOptions.status) {
            jqlParts.push(`status = "${validatedOptions.status}"`);
        }
        if (validatedOptions.createdAfter) {
            jqlParts.push(`created >= "${validatedOptions.createdAfter}"`);
        }
        if (validatedOptions.createdBefore) {
            jqlParts.push(`created <= "${validatedOptions.createdBefore}"`);
        }
        const jql = jqlParts.length > 0 ? jqlParts.join(' AND ') : 'order by created DESC';
        try {
            const response = await this.client.post('/search', {
                jql,
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
            });
            // Validate response
            const result = atlassian_1.JiraSearchResultSchema.parse(response.data);
            return result;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(`Jira API error: ${error.response?.status} - ${error.response?.data?.errorMessages?.join(', ') || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get tickets by assignee with optional date filtering
     */
    async getTicketsByAssignee(assigneeEmail, createdAfter, createdBefore, maxResults = 50) {
        return this.searchTickets({
            assignee: assigneeEmail,
            createdAfter,
            createdBefore,
            maxResults,
        });
    }
    /**
     * Get tickets by creator with optional date filtering
     */
    async getTicketsByCreator(creatorEmail, createdAfter, createdBefore, maxResults = 50) {
        return this.searchTickets({
            creator: creatorEmail,
            createdAfter,
            createdBefore,
            maxResults,
        });
    }
    /**
     * Get tickets created within a specific time frame
     */
    async getTicketsInTimeframe(startDate, endDate, maxResults = 50) {
        return this.searchTickets({
            createdAfter: startDate,
            createdBefore: endDate,
            maxResults,
        });
    }
    /**
     * Get a specific ticket by key
     */
    async getTicketByKey(ticketKey) {
        try {
            const response = await this.client.get(`/issue/${ticketKey}`, {
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
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(`Jira API error: ${error.response?.status} - ${error.response?.data?.errorMessages?.join(', ') || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Test the connection to Jira
     */
    async testConnection() {
        try {
            await this.client.get('/myself');
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.JiraService = JiraService;
//# sourceMappingURL=jira.js.map