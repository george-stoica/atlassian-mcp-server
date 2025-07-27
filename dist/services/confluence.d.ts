import { ConfluencePage, ConfluenceSearchResult, ConfluenceSearchOptions } from '../types/atlassian';
export declare class ConfluenceService {
    private client;
    private baseUrl;
    constructor(baseUrl: string, email: string, apiToken: string);
    /**
     * Search for Confluence pages based on the provided options
     */
    searchPages(options: ConfluenceSearchOptions): Promise<ConfluenceSearchResult>;
    /**
     * Search for pages by text query
     */
    searchPagesByText(query: string, spaceKey?: string, limit?: number): Promise<ConfluenceSearchResult>;
    /**
     * Get pages from a specific space
     */
    getPagesBySpace(spaceKey: string, limit?: number): Promise<ConfluenceSearchResult>;
    /**
     * Get a specific page by ID
     */
    getPageById(pageId: string): Promise<ConfluencePage>;
    /**
     * Get page links for pages matching a query
     */
    getPageLinks(query: string, spaceKey?: string, limit?: number): Promise<string[]>;
    /**
     * Test the connection to Confluence
     */
    testConnection(): Promise<boolean>;
    /**
     * Build CQL (Confluence Query Language) query from search options
     */
    private buildCQLQuery;
}
