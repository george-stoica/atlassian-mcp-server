import { JiraService } from '../services/jira';
import axios, { AxiosError } from 'axios';
import { JiraSearchResult, JiraTicket } from '../types/atlassian';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.isAxiosError
Object.defineProperty(axios, 'isAxiosError', {
  value: jest.fn((error): error is AxiosError => {
    return error && error.response !== undefined;
  })
});

describe('JiraService', () => {
  let jiraService: JiraService;
  const mockBaseUrl = 'https://test.atlassian.net';
  const mockEmail = 'test@example.com';
  const mockApiToken = 'test-token';

  // Mock response data
  const mockJiraTicket: JiraTicket = {
    id: '12345',
    key: 'TEST-123',
    self: 'https://test.atlassian.net/rest/api/3/issue/12345',
    fields: {
      summary: 'Test ticket summary',
      description: 'Test ticket description',
      status: {
        name: 'In Progress',
        statusCategory: {
          key: 'indeterminate',
          name: 'In Progress'
        }
      },
      assignee: {
        accountId: 'user-123',
        displayName: 'John Doe',
        emailAddress: 'john.doe@example.com'
      },
      creator: {
        accountId: 'user-456',
        displayName: 'Jane Smith',
        emailAddress: 'jane.smith@example.com'
      },
      reporter: {
        accountId: 'user-456',
        displayName: 'Jane Smith',
        emailAddress: 'jane.smith@example.com'
      },
      created: '2024-01-01T10:00:00.000Z',
      updated: '2024-01-02T10:00:00.000Z',
      priority: {
        name: 'High',
        id: '2'
      },
      issuetype: {
        name: 'Bug',
        id: '1'
      },
      project: {
        key: 'TEST',
        name: 'Test Project',
        id: '10001'
      }
    }
  };

  const mockSearchResult: JiraSearchResult = {
    expand: 'schema,names',
    startAt: 0,
    maxResults: 50,
    total: 1,
    issues: [mockJiraTicket]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mock instance
    const mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
    };
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    
    jiraService = new JiraService(mockBaseUrl, mockEmail, mockApiToken);
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: `${mockBaseUrl}/rest/api/3`,
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
      new JiraService(`${mockBaseUrl}/`, mockEmail, mockApiToken);
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: `${mockBaseUrl}/rest/api/3`,
        })
      );
    });
  });

  describe('searchTickets', () => {
    it('should search tickets with basic options', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const options = {
        assignee: 'john.doe@example.com',
        maxResults: 25
      };

      const result = await jiraService.searchTickets(options);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'assignee = "john.doe@example.com"',
        startAt: 0,
        maxResults: 25,
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

      expect(result).toEqual(mockSearchResult);
    });

    it('should search tickets with date range', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const options = {
        createdAfter: '2024-01-01T00:00:00.000Z',
        createdBefore: '2024-01-31T23:59:59.999Z',
        maxResults: 50
      };

      const result = await jiraService.searchTickets(options);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'created >= "2024-01-01" AND created <= "2024-01-31"',
        startAt: 0,
        maxResults: 50,
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

      expect(result).toEqual(mockSearchResult);
    });

    it('should search tickets with multiple filters', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const options = {
        assignee: 'john.doe@example.com',
        project: 'TEST',
        status: 'In Progress',
        createdAfter: '2024-01-01T00:00:00.000Z'
      };

      const result = await jiraService.searchTickets(options);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'assignee = "john.doe@example.com" AND project = "TEST" AND status = "In Progress" AND created >= "2024-01-01"',
        startAt: 0,
        maxResults: 50,
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

      expect(result).toEqual(mockSearchResult);
    });

    it('should handle empty search options', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const result = await jiraService.searchTickets({});

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'order by created DESC',
        startAt: 0,
        maxResults: 50,
        fields: expect.any(Array),
        expand: ['renderedFields'],
      });

      expect(result).toEqual(mockSearchResult);
    });

    it('should throw error on API failure', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      const errorResponse = {
        response: {
          status: 400,
          data: {
            errorMessages: ['Invalid JQL query']
          }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      await expect(jiraService.searchTickets({})).rejects.toThrow('Jira API error: 400 - Invalid JQL query');
    });
  });

  describe('getTicketsByAssignee', () => {
    it('should get tickets by assignee', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const result = await jiraService.getTicketsByAssignee('john.doe@example.com');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'assignee = "john.doe@example.com"',
        startAt: 0,
        maxResults: 50,
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

      expect(result).toEqual(mockSearchResult);
    });

    it('should get tickets by assignee with date filter', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const result = await jiraService.getTicketsByAssignee(
        'john.doe@example.com',
        '2024-01-01T00:00:00.000Z',
        '2024-01-31T23:59:59.999Z'
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'assignee = "john.doe@example.com" AND created >= "2024-01-01" AND created <= "2024-01-31"',
        startAt: 0,
        maxResults: 50,
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

      expect(result).toEqual(mockSearchResult);
    });
  });

  describe('getTicketsByCreator', () => {
    it('should get tickets by creator', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const result = await jiraService.getTicketsByCreator('jane.smith@example.com');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'creator = "jane.smith@example.com"',
        startAt: 0,
        maxResults: 50,
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

      expect(result).toEqual(mockSearchResult);
    });
  });

  describe('getTicketsInTimeframe', () => {
    it('should get tickets in timeframe', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.post.mockResolvedValue({ data: mockSearchResult });

      const result = await jiraService.getTicketsInTimeframe(
        '2024-01-01T00:00:00.000Z',
        '2024-01-31T23:59:59.999Z'
      );

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql: 'created >= "2024-01-01" AND created <= "2024-01-31"',
        startAt: 0,
        maxResults: 50,
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

      expect(result).toEqual(mockSearchResult);
    });
  });

  describe('getTicketByKey', () => {
    it('should get ticket by key', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: mockJiraTicket });

      const result = await jiraService.getTicketByKey('TEST-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-123', {
        params: {
          fields: 'summary,description,status,assignee,creator,reporter,created,updated,priority,issuetype,project',
          expand: 'renderedFields',
        },
      });

      expect(result).toEqual(mockJiraTicket);
    });

    it('should throw error for non-existent ticket', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      const errorResponse = {
        response: {
          status: 404,
          data: {
            errorMessages: ['Issue does not exist or you do not have permission to see it.']
          }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      await expect(jiraService.getTicketByKey('NONEXISTENT-123')).rejects.toThrow('Jira API error: 404');
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockResolvedValue({ data: {} });

      const result = await jiraService.testConnection();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/myself');
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      const mockAxiosInstance = mockedAxios.create() as jest.Mocked<any>;
      mockAxiosInstance.get.mockRejectedValue(new Error('Network error'));

      const result = await jiraService.testConnection();

      expect(result).toBe(false);
    });
  });
});
