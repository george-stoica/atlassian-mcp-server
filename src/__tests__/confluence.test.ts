import { ConfluenceService } from '../services/confluence';
import axios, { AxiosError } from 'axios';
import { ConfluenceSearchResult, ConfluencePage } from '../types/atlassian';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.isAxiosError
Object.defineProperty(axios, 'isAxiosError', {
  value: jest.fn((error): error is AxiosError => {
    return error && error.response !== undefined;
  })
});

describe('ConfluenceService', () => {
  let confluenceService: ConfluenceService;
  const mockBaseUrl = 'https://test.atlassian.net';
  const mockEmail = 'test@example.com';
  const mockApiToken = 'test-token';
  const mockDevopsSpaceKey = 'DEVOPS';

  // Mock response data
  const mockConfluencePage: ConfluencePage = {
    id: '123456',
    type: 'page',
    status: 'current',
    title: 'Test Page Title',
    space: {
      id: '98765',
      key: 'DEVOPS',
      name: 'DevOps Space'
    },
    version: {
      number: 1,
      when: '2024-01-01T10:00:00.000Z',
      by: {
        type: 'user',
        accountId: 'user-123',
        displayName: 'Test User'
      }
    },
    _links: {
      webui: '/spaces/DEVOPS/pages/123456/Test+Page+Title',
      self: 'https://test.atlassian.net/wiki/api/v2/pages/123456'
    }
  };

  const mockSearchResult: ConfluenceSearchResult = {
    results: [mockConfluencePage],
    start: 0,
    limit: 25,
    size: 1,
    _links: {
      context: 'https://test.atlassian.net/wiki',
      self: 'https://test.atlassian.net/wiki/api/v2/pages',
      base: 'https://test.atlassian.net/wiki'
    }
  };

  // Mock search result with pagination info for API responses
  const mockApiSearchResult = {
    results: [{
      id: '123456',
      type: 'page',
      status: 'current',
      title: 'Test Page Title',
      space: { 
        id: '98765',
        key: 'DEVOPS', 
        name: 'DevOps Space'
      },
      version: {
        number: 1,
        when: '2024-01-01T10:00:00.000Z',
        by: { 
          type: 'user',
          accountId: 'user-123', 
          displayName: 'Test User' 
        }
      },
      _links: {
        webui: '/spaces/DEVOPS/pages/123456/Test+Page+Title',
        self: 'https://test.atlassian.net/wiki/api/v2/pages/123456'
      }
    }],
    start: 0,
    limit: 25,
    size: 1,
    _links: {
      context: 'https://test.atlassian.net/wiki',
      self: 'https://test.atlassian.net/wiki/api/v2/pages',
      base: 'https://test.atlassian.net/wiki'
    }
  };

  // Mock empty search result
  const mockEmptyApiSearchResult = {
    results: [],
    start: 0,
    limit: 25,
    size: 0,
    _links: {
      context: 'https://test.atlassian.net/wiki',
      self: 'https://test.atlassian.net/wiki/api/v2/pages',
      base: 'https://test.atlassian.net/wiki'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mock instance
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
    };
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    
    confluenceService = new ConfluenceService(mockBaseUrl, mockEmail, mockApiToken, mockDevopsSpaceKey);
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: `${mockBaseUrl}/wiki/api/v2`,
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

    it('should remove trailing slash from baseUrl', () => {
      new ConfluenceService(`${mockBaseUrl}/`, mockEmail, mockApiToken, mockDevopsSpaceKey);
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: `${mockBaseUrl}/wiki/api/v2`,
        })
      );
    });
  });

  describe('searchPages', () => {
    it('should search pages with basic query', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const options = {
        query: 'test search',
        limit: 25,
        start: 0
      };

      const result = await confluenceService.searchPages(options);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "test search" AND space.key = "DEVOPS" AND type = "page"',
          limit: 25,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should search pages with space filter', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const options = {
        query: 'test search',
        spaceKey: 'TEST',
        type: 'page' as const,
        limit: 25,
        start: 0
      };

      const result = await confluenceService.searchPages(options);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "test search" AND space.key = "TEST" AND type = "page"',
          limit: 25,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should search for blog posts', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const options = {
        query: 'blog post search',
        type: 'blogpost' as const,
        limit: 10,
        start: 0
      };

      const result = await confluenceService.searchPages(options);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "blog post search" AND space.key = "DEVOPS" AND type = "blogpost"',
          limit: 10,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should throw error on API failure', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: 'Invalid CQL query'
          }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(confluenceService.searchPages({
        query: 'test',
        type: 'page'
      })).rejects.toThrow('Confluence API error: 400 - Invalid CQL query');
    });

    it('should validate input parameters', async () => {
      // Test with empty query
      await expect(confluenceService.searchPages({
        query: '',
        type: 'page'
      })).rejects.toThrow();

      // Test with invalid limit
      await expect(confluenceService.searchPages({
        query: 'test',
        type: 'page',
        limit: 101
      })).rejects.toThrow();
    });
  });

  describe('searchPagesByText', () => {
    it('should search pages by text query', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const result = await confluenceService.searchPagesByText('test query');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "test query" AND space.key = "DEVOPS" AND type = "page"',
          limit: 25,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should search pages by text query with custom limit', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const result = await confluenceService.searchPagesByText('test query', 10);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "test query" AND space.key = "DEVOPS" AND type = "page"',
          limit: 10,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });
  });

  describe('getPagesBySpace', () => {
    it('should get pages by space key', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const result = await confluenceService.getPagesBySpace('TEST');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          'space-key': 'TEST',
          limit: 25,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should get pages by space key with custom limit', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const result = await confluenceService.getPagesBySpace('TEST', 50);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          'space-key': 'TEST',
          limit: 50,
          start: 0,
        },
      });

      expect(result).toEqual(mockSearchResult);
    });
  });

  describe('getPageById', () => {
    it('should get page by ID', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockConfluencePage });

      const result = await confluenceService.getPageById('123456');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages/123456');
      expect(result).toEqual(mockConfluencePage);
    });

    it('should throw error for non-existent page', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      const errorResponse = {
        response: {
          status: 404,
          data: {
            message: 'Page not found'
          }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(confluenceService.getPageById('nonexistent')).rejects.toThrow('Confluence API error: 404 - Page not found');
    });
  });

  describe('getPageLinks', () => {
    it('should get page links for search query', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const result = await confluenceService.getPageLinks('test query');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "test query" AND space.key = "DEVOPS" AND type = "page"',
          limit: 25,
          start: 0,
        },
      });

      expect(result).toEqual([
        `${mockBaseUrl}${mockConfluencePage._links.webui}`
      ]);
    });

    it('should get page links with custom limit', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockApiSearchResult });

      const result = await confluenceService.getPageLinks('test query', 10);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', {
        params: {
          cql: 'text ~ "test query" AND space.key = "DEVOPS" AND type = "page"',
          limit: 10,
          start: 0,
        },
      });

      expect(result).toEqual([
        `${mockBaseUrl}${mockConfluencePage._links.webui}`
      ]);
    });

    it('should return empty array when no pages found', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ 
        data: mockEmptyApiSearchResult
      });

      const result = await confluenceService.getPageLinks('nonexistent query');

      expect(result).toEqual([]);
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockSearchResult });

      const result = await confluenceService.testConnection();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pages', { params: { limit: 1 } });
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const result = await confluenceService.testConnection();

      expect(result).toBe(false);
    });
  });

  describe('buildCQLQuery', () => {
    it('should build CQL query with all conditions', () => {
      const confluenceServiceAny = confluenceService as any;
      
      const query = confluenceServiceAny.buildCQLQuery({
        query: 'test search',
        spaceKey: 'TEST',
        type: 'page'
      });

      expect(query).toBe('text ~ "test search" AND space.key = "TEST" AND type = "page"');
    });

    it('should build CQL query without space key', () => {
      const confluenceServiceAny = confluenceService as any;
      
      const query = confluenceServiceAny.buildCQLQuery({
        query: 'test search',
        type: 'blogpost'
      });

      expect(query).toBe('text ~ "test search" AND space.key = "DEVOPS" AND type = "blogpost"');
    });

    it('should handle empty query text', () => {
      const confluenceServiceAny = confluenceService as any;
      
      const query = confluenceServiceAny.buildCQLQuery({
        query: '   ',
        type: 'page'
      });

      expect(query).toBe('space.key = "DEVOPS" AND type = "page"');
    });
  });
});
