#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import { JiraService } from './services/jira.js';
import { ConfluenceService } from './services/confluence.js';
import { AtlassianConfigSchema } from './schemas/atlassian.js';
import { 
  JiraSearchOptionsSchema, 
  ConfluenceSearchOptionsSchema,
  type ConfluenceSearchOptions
} from './schemas/atlassian.js';
import type { ConfluenceSearchOptions as ConfluenceSearchOptionsType } from './types/atlassian.js';

// Load environment variables
dotenv.config();

class AtlassianMCPServer {
  private server: Server;
  private jiraService!: JiraService;
  private confluenceService!: ConfluenceService;

  constructor() {
    this.server = new Server(
      {
        name: process.env.MCP_SERVER_NAME || 'Atlassian MCP Server',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize services
    this.initializeServices();
    this.setupHandlers();
  }

  private initializeServices(): void {
    try {
      const config = AtlassianConfigSchema.parse({
        jira: {
          baseUrl: process.env.JIRA_BASE_URL,
          email: process.env.JIRA_EMAIL,
          apiToken: process.env.JIRA_API_TOKEN,
        },
        confluence: {
          baseUrl: process.env.CONFLUENCE_BASE_URL,
          email: process.env.CONFLUENCE_EMAIL,
          apiToken: process.env.CONFLUENCE_API_TOKEN,
        },
      });

      this.jiraService = new JiraService(
        config.jira.baseUrl,
        config.jira.email,
        config.jira.apiToken
      );

      this.confluenceService = new ConfluenceService(
        config.confluence.baseUrl,
        config.confluence.email,
        config.confluence.apiToken
      );
    } catch (error) {
      console.error('❌ Failed to initialize Atlassian services');
      console.error('');
      console.error('🔧 Please ensure your .env file contains the following variables:');
      console.error('   - JIRA_BASE_URL (e.g., https://your-domain.atlassian.net)');
      console.error('   - JIRA_EMAIL (your Atlassian account email)');
      console.error('   - JIRA_API_TOKEN (your Jira API token)');
      console.error('   - CONFLUENCE_BASE_URL (e.g., https://your-domain.atlassian.net)');
      console.error('   - CONFLUENCE_EMAIL (your Atlassian account email)');
      console.error('   - CONFLUENCE_API_TOKEN (your Confluence API token)');
      console.error('');
      console.error('📚 For help getting API tokens, visit:');
      console.error('   https://id.atlassian.com/manage-profile/security/api-tokens');
      console.error('');
      console.error('Original error:', error);
      process.exit(1);
    }
  }

  /**
   * Map team name to team identifier using environment variables
   */
  private mapTeamNameToIdentifier(teamName: string): string {
    const teamMappings: Record<string, string> = {
      'Asia DevOps Team': process.env.DEVOPS_TEAM_ID || '',
    };

    const teamIdentifier = teamMappings[teamName];
    if (!teamIdentifier) {
      throw new Error(`Unknown team: ${teamName}. Available teams: ${Object.keys(teamMappings).join(', ')}`);
    }

    return teamIdentifier;
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getAvailableTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_jira_tickets':
            return await this.handleSearchJiraTickets(args);
          case 'get_jira_tickets_by_assignee':
            return await this.handleGetJiraTicketsByAssignee(args);
          case 'get_jira_tickets_by_creator':
            return await this.handleGetJiraTicketsByCreator(args);
          case 'get_jira_tickets_in_timeframe':
            return await this.handleGetJiraTicketsInTimeframe(args);
          case 'search_confluence_pages':
            return await this.handleSearchConfluencePages(args);
          case 'get_confluence_page_links':
            return await this.handleGetConfluencePageLinks(args);
          case 'get_jira_tickets_by_team_and_status':
            return await this.handleGetJiraTicketsByTeamAndStatus(args);
          case 'search_jira_tickets_by_text':
            return await this.handleSearchJiraTicketsByText(args);
          case 'search_jira_tickets_flexible':
            return await this.handleSearchJiraTicketsFlexible(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private getAvailableTools(): Tool[] {
    return [
      {
        name: 'search_jira_tickets',
        description: 'Search for Jira tickets with various filters',
        inputSchema: {
          type: 'object',
          properties: {
            assignee: {
              type: 'string',
              description: 'Email of the assignee',
            },
            creator: {
              type: 'string',
              description: 'Email of the creator',
            },
            createdAfter: {
              type: 'string',
              description: 'ISO date string for tickets created after this date',
            },
            createdBefore: {
              type: 'string',
              description: 'ISO date string for tickets created before this date',
            },
            updatedAfter: {
              type: 'string',
              description: 'ISO date string for tickets updated after this date',
            },
            updatedBefore: {
              type: 'string',
              description: 'ISO date string for tickets updated before this date',
            },
            project: {
              type: 'string',
              description: 'Project key',
            },
            status: {
              type: 'string',
              description: 'Ticket status (single status)',
            },
            statuses: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Multiple ticket statuses to search for',
            },
            team: {
              type: 'string',
              description: 'Team name to search for (e.g., "Asia DevOps Team")',
            },
            summary: {
              type: 'string',
              description: 'Text to search for in ticket summaries',
            },
            description: {
              type: 'string',
              description: 'Text to search for in ticket descriptions',
            },
            textSearch: {
              type: 'string',
              description: 'Text to search for in both summary and description',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results (1-100)',
              default: 50,
            },
            startAt: {
              type: 'number',
              description: 'Starting index for pagination',
              default: 0,
            },
          },
        },
      },
      {
        name: 'get_jira_tickets_by_assignee',
        description: 'Get Jira tickets assigned to a specific user with optional date filtering',
        inputSchema: {
          type: 'object',
          properties: {
            assigneeEmail: {
              type: 'string',
              description: 'Email of the assignee',
            },
            project: {
              type: 'string',
              description: 'Project key to limit search to specific project',
            },
            createdAfter: {
              type: 'string',
              description: 'ISO date string for tickets created after this date',
            },
            createdBefore: {
              type: 'string',
              description: 'ISO date string for tickets created before this date',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
          },
          required: ['assigneeEmail'],
        },
      },
      {
        name: 'get_jira_tickets_by_creator',
        description: 'Get Jira tickets created by a specific user with optional date filtering',
        inputSchema: {
          type: 'object',
          properties: {
            creatorEmail: {
              type: 'string',
              description: 'Email of the creator',
            },
            project: {
              type: 'string',
              description: 'Project key to limit search to specific project',
            },
            createdAfter: {
              type: 'string',
              description: 'ISO date string for tickets created after this date',
            },
            createdBefore: {
              type: 'string',
              description: 'ISO date string for tickets created before this date',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
          },
          required: ['creatorEmail'],
        },
      },
      {
        name: 'get_jira_tickets_in_timeframe',
        description: 'Get Jira tickets created within a specific time frame',
        inputSchema: {
          type: 'object',
          properties: {
            startDate: {
              type: 'string',
              description: 'ISO date string for the start of the time frame',
            },
            endDate: {
              type: 'string',
              description: 'ISO date string for the end of the time frame',
            },
            project: {
              type: 'string',
              description: 'Project key to limit search to specific project',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
          },
          required: ['startDate', 'endDate'],
        },
      },
      {
        name: 'search_confluence_pages',
        description: 'Search for Confluence pages based on text query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Text to search for in pages',
            },
            spaceKey: {
              type: 'string',
              description: 'Space key to limit search to specific space',
            },
            type: {
              type: 'string',
              enum: ['page', 'blogpost'],
              description: 'Type of content to search for',
              default: 'page',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              default: 25,
            },
            start: {
              type: 'number',
              description: 'Starting index for pagination',
              default: 0,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_confluence_page_links',
        description: 'Get links to Confluence pages based on a search query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Text to search for in pages',
            },
            spaceKey: {
              type: 'string',
              description: 'Space key to limit search to specific space',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              default: 25,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_jira_tickets_by_team_and_status',
        description: 'Get Jira tickets for a specific team with specific statuses',
        inputSchema: {
          type: 'object',
          properties: {
            team: {
              type: 'string',
              description: 'Team name to search for (e.g., "Asia DevOps Team")',
            },
            statuses: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of ticket statuses to search for (e.g., ["To Do", "In Progress"])',
            },
            project: {
              type: 'string',
              description: 'Project key to limit search to specific project',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
          },
          required: ['team', 'statuses'],
        },
      },
      {
        name: 'search_jira_tickets_by_text',
        description: 'Search for Jira tickets by text in summary or description',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text to search for in both summary and description',
            },
            project: {
              type: 'string',
              description: 'Project key to limit search to specific project',
            },
            status: {
              type: 'string',
              description: 'Ticket status to filter by',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'search_jira_tickets_flexible',
        description: 'Search for Jira tickets with flexible text search supporting multiple terms with OR logic',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: 'Project key to limit search to specific project',
            },
            status: {
              type: 'string',
              description: 'Ticket status to filter by',
            },
            textSearchTerms: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of text terms to search for in both summary and description (OR logic)',
            },
            summaryTerms: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of text terms to search for in summary only (OR logic)',
            },
            descriptionTerms: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of text terms to search for in description only (OR logic)',
            },
            assignee: {
              type: 'string',
              description: 'Email of the assignee',
            },
            creator: {
              type: 'string',
              description: 'Email of the creator',
            },
            createdAfter: {
              type: 'string',
              description: 'ISO date string for tickets created after this date',
            },
            createdBefore: {
              type: 'string',
              description: 'ISO date string for tickets created before this date',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
            startAt: {
              type: 'number',
              description: 'Starting index for pagination',
              default: 0,
            },
          },
        },
      },
    ];
  }

  private async handleSearchJiraTickets(args: any) {
    // Handle both single status and multiple statuses
    if (args.statuses && !args.status) {
      args.status = args.statuses;
    }
    
    // Map team name to team identifier if team is provided
    if (args.team) {
      const teamIdentifier = this.mapTeamNameToIdentifier(args.team);
      args.teamIdentifier = teamIdentifier;
      delete args.team; // Remove the team property since we're using teamIdentifier internally
    }
    
    const options = JiraSearchOptionsSchema.parse(args);
    const result = await this.jiraService.searchTickets(options);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetJiraTicketsByAssignee(args: any) {
    const { assigneeEmail, project, createdAfter, createdBefore, maxResults } = args;
    const result = await this.jiraService.searchTickets({
      assignee: assigneeEmail,
      project,
      createdAfter,
      createdBefore,
      maxResults,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetJiraTicketsByCreator(args: any) {
    const { creatorEmail, project, createdAfter, createdBefore, maxResults } = args;
    const result = await this.jiraService.searchTickets({
      creator: creatorEmail,
      project,
      createdAfter,
      createdBefore,
      maxResults,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetJiraTicketsInTimeframe(args: any) {
    const { startDate, endDate, project, maxResults } = args;
    const result = await this.jiraService.searchTickets({
      createdAfter: startDate,
      createdBefore: endDate,
      project,
      maxResults,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchConfluencePages(args: any) {
    const options = ConfluenceSearchOptionsSchema.parse(args) as ConfluenceSearchOptionsType;
    const result = await this.confluenceService.searchPages(options);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetConfluencePageLinks(args: any) {
    const { query, spaceKey, limit } = args;
    const links = await this.confluenceService.getPageLinks(query, spaceKey, limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ links }, null, 2),
        },
      ],
    };
  }

  private async handleGetJiraTicketsByTeamAndStatus(args: any) {
    const { team, statuses, project, maxResults } = args;
    
    // Map team name to team identifier
    const teamIdentifier = this.mapTeamNameToIdentifier(team);
    
    const result = await this.jiraService.searchTickets({
      teamIdentifier,
      status: statuses,
      project,
      maxResults,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchJiraTicketsByText(args: any) {
    const { text, project, status, maxResults } = args;
    
    const result = await this.jiraService.searchTickets({
      textSearch: text,
      project,
      status,
      maxResults,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchJiraTicketsFlexible(args: any) {
    const options = JiraSearchOptionsSchema.parse(args);
    const result = await this.jiraService.searchTickets(options);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Atlassian MCP Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new AtlassianMCPServer();
  server.run().catch(console.error);
}

export { AtlassianMCPServer };
