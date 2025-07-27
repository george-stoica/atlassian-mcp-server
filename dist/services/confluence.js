"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfluenceService = void 0;
const axios_1 = __importDefault(require("axios"));
const atlassian_1 = require("../schemas/atlassian");
class ConfluenceService {
    constructor(baseUrl, email, apiToken) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.client = axios_1.default.create({
            baseURL: `${this.baseUrl}/wiki/api/v2`,
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
    async searchPages(options) {
        // Validate input
        const validatedOptions = atlassian_1.ConfluenceSearchOptionsSchema.parse(options);
        const params = {
            cql: this.buildCQLQuery(validatedOptions),
            limit: validatedOptions.limit,
            start: validatedOptions.start,
        };
        try {
            const response = await this.client.get('/pages', { params });
            // Validate response
            const result = atlassian_1.ConfluenceSearchResultSchema.parse(response.data);
            return result;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Search for pages by text query
     */
    async searchPagesByText(query, spaceKey, limit = 25) {
        return this.searchPages({
            query,
            spaceKey,
            type: 'page',
            limit,
        });
    }
    /**
     * Get pages from a specific space
     */
    async getPagesBySpace(spaceKey, limit = 25) {
        const params = {
            'space-key': spaceKey,
            limit,
            start: 0,
        };
        try {
            const response = await this.client.get('/pages', { params });
            // Validate response
            const result = atlassian_1.ConfluenceSearchResultSchema.parse(response.data);
            return result;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get a specific page by ID
     */
    async getPageById(pageId) {
        try {
            const response = await this.client.get(`/pages/${pageId}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get page links for pages matching a query
     */
    async getPageLinks(query, spaceKey, limit = 25) {
        const searchResult = await this.searchPagesByText(query, spaceKey, limit);
        return searchResult.results.map(page => {
            // Construct the full URL using the webui link
            return `${this.baseUrl}${page._links.webui}`;
        });
    }
    /**
     * Test the connection to Confluence
     */
    async testConnection() {
        try {
            await this.client.get('/pages', { params: { limit: 1 } });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Build CQL (Confluence Query Language) query from search options
     */
    buildCQLQuery(options) {
        const conditions = [];
        // Add text search condition
        if (options.query.trim()) {
            conditions.push(`text ~ "${options.query.trim()}"`);
        }
        // Add space filter if specified
        if (options.spaceKey) {
            conditions.push(`space.key = "${options.spaceKey}"`);
        }
        // Add type filter
        conditions.push(`type = "${options.type}"`);
        return conditions.join(' AND ');
    }
}
exports.ConfluenceService = ConfluenceService;
//# sourceMappingURL=confluence.js.map