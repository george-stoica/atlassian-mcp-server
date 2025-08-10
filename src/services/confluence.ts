import axios, { AxiosInstance } from 'axios';
import { ConfluencePage, ConfluenceSearchResult, ConfluenceSearchOptions, ConfluenceSearchLinksResult } from '../types/atlassian';
import { 
  ConfluenceSearchOptionsSchema, 
  ConfluenceSearchResultV2Schema, 
  ConfluenceSearchLinksResultSchema,
  FlexibleConfluenceResponseSchema
} from '../schemas/atlassian';
import { 
  transformConfluenceV2Response, 
  isV2Response 
} from '../utils/confluence-transformers';

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

    // Use space-specific endpoint if spaceKey is provided
    const spaceKey = validatedOptions.spaceKey ?? this.devopsSpaceKey;
    
    if (spaceKey) {
      return this.searchPagesInSpace(validatedOptions, spaceKey);
    } else {
      return this.searchPagesGlobal(validatedOptions);
    }
  }

  /**
   * Search for pages in a specific space
   */
  private async searchPagesInSpace(options: ConfluenceSearchOptions, spaceKey: string): Promise<ConfluenceSearchResult | ConfluenceSearchLinksResult> {
    const params: Record<string, string | number> = {
      'space-key': spaceKey,
      limit: options.limit || 25,
    };

    // Add cursor if provided (v2 pagination)
    if (options.cursor) {
      params.cursor = options.cursor;
    }

    try {
      const response = await this.client.get('/pages', { params });

      // Filter results by query text if provided
      let filteredResults = response.data.results;
      
      if (options.query.trim()) {
        const searchTerm = options.query.trim().toLowerCase();
        filteredResults = response.data.results.filter((page: any) => {
          const title = page.title?.toLowerCase() || '';
          const body = page.body?.view?.value?.toLowerCase() || '';
          return title.includes(searchTerm) || body.includes(searchTerm);
        });
      }

      // Filter by type
      if (options.type) {
        filteredResults = filteredResults.filter((page: any) => page.type === options.type);
      }

      if (options.outputFormat === 'links_only') {
        const links = filteredResults.map((page: any) => `${this.baseUrl}${page._links.webui}`);
        return {
          links,
          total: filteredResults.length,
          limit: options.limit || 25,
        };
      }

      // Transform response to unified format
      return {
        results: filteredResults.map((page: any) => ({
          id: page.id || '',
          type: page.type || 'page',
          status: page.status || 'current',
          title: page.title || '',
          spaceId: page.spaceId || '',
          parentId: page.parentId,
          _links: {
            webui: page._links?.webui || '',
            self: page._links?.self || '',
            base: page._links?.base || '',
            editui: page._links?.editui || '',
            tinyui: page._links?.tinyui || '',
          },
          body: page.body,
        })),
        start: 0,
        limit: options.limit || 25,
        size: filteredResults.length,
        _links: {
          context: response.data._links?.context || '',
          self: response.data._links?.self || '',
          base: response.data._links?.base || '',
          next: response.data._links?.next,
        },
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Confluence API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search for pages globally using CQL
   */
  private async searchPagesGlobal(options: ConfluenceSearchOptions): Promise<ConfluenceSearchResult | ConfluenceSearchLinksResult> {
    const params: Record<string, string | number> = {
      cql: this.buildCQLQuery(options),
      limit: options.limit || 25,
    };

    // Add cursor if provided (v2 pagination)
    if (options.cursor) {
      params.cursor = options.cursor;
    }

    try {
      const response = await this.client.get('/pages', { params });

      // Try v2 schema first, fallback to flexible parsing
      try {
        const apiResult = ConfluenceSearchResultV2Schema.parse(response.data);
        
        if (options.outputFormat === 'links_only') {
          const links = apiResult.results.map((page: any) => `${this.baseUrl}${page._links.webui}`);
          return {
            links,
            total: apiResult.results.length,
            limit: options.limit || 25,
          };
        }

        // Transform v2 response to unified format
        return transformConfluenceV2Response(apiResult);
      } catch (schemaError) {
        // Fallback to flexible parsing
        console.warn('V2 schema validation failed, using transformation:', (schemaError as Error).message);
        return this.transformFlexibleResponse(response.data, options);
      }
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
    };

    try {
      const response = await this.client.get('/pages', { params });

      // Validate response using v2 schema
      const apiResult = ConfluenceSearchResultV2Schema.parse(response.data);
      
      // Transform v2 response to unified format
      return transformConfluenceV2Response(apiResult);
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
    if (spaceKey) {
      // v2 uses space.key syntax in CQL
      conditions.push(`space.key = "${spaceKey}"`);
    }

    // Add type filter
    conditions.push(`type = "${options.type}"`);

    return conditions.join(' AND ');
  }

  /**
   * Debug method to expose CQL query generation
   */
  public debugCQLQuery(options: ConfluenceSearchOptions): string {
    return this.buildCQLQuery(options);
  }

  /**
   * Transform flexible response when schema validation fails
   */
  private transformFlexibleResponse(response: any, options: any): ConfluenceSearchResult | ConfluenceSearchLinksResult {
    // Validate with flexible schema
    const flexibleResult = FlexibleConfluenceResponseSchema.parse(response);
    
    if (options.outputFormat === 'links_only') {
      const links = flexibleResult.results.map((page: any) => 
        `${this.baseUrl}${page._links?.webui || page.webui || ''}`
      );
      return {
        links,
        total: flexibleResult.results.length,
        limit: options.limit,
      };
    }

    // Detect if it's v2 format and transform accordingly
    if (isV2Response(flexibleResult)) {
      return transformConfluenceV2Response(flexibleResult);
    } else {
      // Fallback transformation for unknown format
      return {
        results: flexibleResult.results.map((page: any) => ({
          id: page.id || '',
          type: page.type || 'page',
          status: page.status || 'current',
          title: page.title || '',
          spaceId: page.spaceId || page.space?.id || '',
          parentId: page.parentId,
          _links: {
            webui: page._links?.webui || page.webui || '',
            self: page._links?.self || page._links?.editui,
            base: page._links?.base,
            editui: page._links?.editui,
            tinyui: page._links?.tinyui,
          },
          body: page.body,
        })),
        start: 0,
        limit: options.limit,
        size: flexibleResult.results.length,
        _links: {
          context: flexibleResult._links?.context || '',
          self: flexibleResult._links?.self || flexibleResult._links?.base || '',
          base: flexibleResult._links?.base,
          next: flexibleResult._links?.next,
        },
      };
    }
  }
}
