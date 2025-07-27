import axios, { AxiosInstance } from 'axios';
import { ConfluencePage, ConfluenceSearchResult, ConfluenceSearchOptions } from '../types/atlassian';
import { ConfluenceSearchOptionsSchema, ConfluenceSearchResultSchema } from '../schemas/atlassian';

export class ConfluenceService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string, email: string, apiToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
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
  async searchPages(options: ConfluenceSearchOptions): Promise<ConfluenceSearchResult> {
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
      const result = ConfluenceSearchResultSchema.parse(response.data);
      return result as ConfluenceSearchResult;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search for pages by text query
   */
  async searchPagesByText(query: string, spaceKey?: string, limit = 25): Promise<ConfluenceSearchResult> {
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
  async getPagesBySpace(spaceKey: string, limit = 25): Promise<ConfluenceSearchResult> {
    const params: Record<string, string | number> = {
      'space-key': spaceKey,
      limit,
      start: 0,
    };

    try {
      const response = await this.client.get('/pages', { params });

      // Validate response
      const result = ConfluenceSearchResultSchema.parse(response.data);
      return result as ConfluenceSearchResult;
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
   * Get page links for pages matching a query
   */
  async getPageLinks(query: string, spaceKey?: string, limit = 25): Promise<string[]> {
    const searchResult = await this.searchPagesByText(query, spaceKey, limit);
    
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
   */
  private buildCQLQuery(options: ConfluenceSearchOptions): string {
    const conditions: string[] = [];

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
