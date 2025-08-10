import axios, { AxiosInstance } from 'axios';
import { ConfluencePage, ConfluenceSearchResult, ConfluenceSearchOptions, ConfluenceSearchLinksResult } from '../types/atlassian';
import { ConfluenceSearchOptionsSchema, ConfluenceSearchResultSchema, ConfluenceSearchLinksResultSchema } from '../schemas/atlassian';

export class ConfluenceService {
  private client: AxiosInstance;
  private baseUrl: string;
  private devopsSpaceKey: string;

  constructor(baseUrl: string, email: string, apiToken: string, devopsSpaceKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.devopsSpaceKey = devopsSpaceKey; // Used as default when no spaceKey is provided
    this.client = axios.create({
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
  async searchPages(options: ConfluenceSearchOptions): Promise<ConfluenceSearchResult | ConfluenceSearchLinksResult> {
    // Validate input
    const validatedOptions = ConfluenceSearchOptionsSchema.parse(options);

    const params: Record<string, string | number> = {
      cql: this.buildCQLQuery(validatedOptions as ConfluenceSearchOptions),
      limit: validatedOptions.limit,
      start: validatedOptions.start,
    };

    try {
      const response = await this.client.get('/pages', { params });

      // Validate response
      const apiResult = ConfluenceSearchResultSchema.parse(response.data);

      // Return different formats based on outputFormat
      if (validatedOptions.outputFormat === 'links_only') {
        const links = apiResult.results.map(page => `${this.baseUrl}${page._links.webui}`);
        return {
          links,
          total: apiResult.results.length,
          start: validatedOptions.start,
          limit: validatedOptions.limit,
        };
      }

      // Transform API response to expected return type
      const searchResult: ConfluenceSearchResult = {
        results: apiResult.results,
        start: apiResult.start,
        limit: apiResult.limit,
        size: apiResult.size,
        _links: {
          context: apiResult._links.context,
          self: apiResult._links.self,
          base: apiResult._links.base,
          next: apiResult._links.next,
          prev: apiResult._links.prev
        }
      };

      return searchResult;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search for pages by text query in the DevOps space
   */
  async searchPagesByText(query: string, limit = 25): Promise<ConfluenceSearchResult> {
    const result = await this.searchPages({
      query,
      type: 'page',
      outputFormat: 'full',
      limit,
    });
    return result as ConfluenceSearchResult;
  }

  /**
   * Get pages from a specific space
   */
  async getPagesBySpace(spaceKey: string, limit = 25): Promise<ConfluenceSearchResult> {
    const params: Record<string, string | number> = {
      'space-key': spaceKey,
      limit,
      start: 0,
    };

    try {
      const response = await this.client.get('/pages', { params });

      // Validate response
      const apiResult = ConfluenceSearchResultSchema.parse(response.data);
      
      // Transform API response to expected return type
      const searchResult: ConfluenceSearchResult = {
        results: apiResult.results,
        start: apiResult.start,
        limit: apiResult.limit,
        size: apiResult.size,
        _links: {
          context: apiResult._links.context,
          self: apiResult._links.self,
          base: apiResult._links.base,
          next: apiResult._links.next,
          prev: apiResult._links.prev
        }
      };

      return searchResult;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a specific page by ID
   */
  async getPageById(pageId: string): Promise<ConfluencePage> {
    try {
      const response = await this.client.get(`/pages/${pageId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get page links for pages matching a query in the DevOps space
   */
  async getPageLinks(query: string, limit = 25): Promise<string[]> {
    const searchResult = await this.searchPagesByText(query, limit);
    
    return searchResult.results.map(page => {
      // Construct the full URL using the webui link
      return `${this.baseUrl}${page._links.webui}`;
    });
  }

  /**
   * Test the connection to Confluence
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/pages', { params: { limit: 1 } });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Build CQL (Confluence Query Language) query from search options
   * Uses provided spaceKey or defaults to the DevOps space key
   */
  private buildCQLQuery(options: ConfluenceSearchOptions): string {
    const conditions: string[] = [];

    // Add text search condition
    if (options.query.trim()) {
      conditions.push(`text ~ "${options.query.trim()}"`);
    }

    // Use provided spaceKey or default to DevOps space key
    const spaceKey = options.spaceKey ?? this.devopsSpaceKey;
    conditions.push(`space.key = "${spaceKey}"`);

    // Add type filter
    conditions.push(`type = "${options.type}"`);

    return conditions.join(' AND ');
  }
}
