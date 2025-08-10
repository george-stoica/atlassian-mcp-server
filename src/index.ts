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
        config.confluence.apiToken,
        process.env.DEVOPS_SPACE_KEY || 'DEVOPS'
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
      console.error('   - DEVOPS_SPACE_KEY (your DevOps space key, e.g., DEVOPS)');
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
          case 'get_jira_ticket':
            return await this.handleGetJiraTicket(args);
          case 'search_confluence_content':
            return await this.handleSearchConfluenceContent(args);
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
        description: 'Search for Jira tickets with comprehensive filtering options',
        inputSchema: {
          type: 'object',
          properties: {
            // User/Role filters
            assignee: {
              type: 'string',
              description: 'Email of the assignee',
            },
            creator: {
              type: 'string',
              description: 'Email of the creator',
            },
            team: {
              type: 'string',
              description: 'Team name to search for (e.g., "Asia DevOps Team")',
            },
            
            // Project/Status filters
            project: {
              type: 'string',
              description: 'Project key',
            },
            status: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
              ],
              description: 'Single status or array of statuses',
            },
            
            // Date filters
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
            
            // Text search options
            textSearch: {
              type: 'string',
              description: 'Search text in both summary and description',
            },
            summarySearch: {
              type: 'string',
              description: 'Search text only in summary',
            },
            descriptionSearch: {
              type: 'string',
              description: 'Search text only in description',
            },
            textSearchTerms: {
              type: 'array',
              items: { type: 'string' },
              description: 'Multiple terms with OR logic for summary and description',
            },
            summaryTerms: {
              type: 'array',
              items: { type: 'string' },
              description: 'Multiple terms with OR logic for summary only',
            },
            descriptionTerms: {
              type: 'array',
              items: { type: 'string' },
              description: 'Multiple terms with OR logic for description only',
            },
            
            // Pagination
            maxResults: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'Maximum number of results (1-100)',
            },
            startAt: {
              type: 'number',
              minimum: 0,
              default: 0,
              description: 'Starting index for pagination',
            },
          },
        },
      },
      {
        name: 'get_jira_ticket',
        description: 'Get a specific Jira ticket by its key',
        inputSchema: {
          type: 'object',
          properties: {
            ticketKey: {
              type: 'string',
              description: 'Jira ticket key (e.g., "PROJ-123")',
              pattern: '^[A-Z]+-[0-9]+$',
            },
          },
          required: ['ticketKey'],
        },
      },
      {
        name: 'search_confluence_content',
        description: 'Search for Confluence content in the DevOps space only',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Text to search for in pages',
            },
            type: {
              type: 'string',
              enum: ['page', 'blogpost'],
              default: 'page',
              description: 'Type of content to search for',
            },
            outputFormat: {
              type: 'string',
              enum: ['full', 'links_only'],
              default: 'full',
              description: 'Return full page details or just links',
            },
            limit: {
              type: 'number',
              minimum: 1,
              maximum: 100,
              default: 25,
              description: 'Maximum number of results',
            },
            start: {
              type: 'number',
              minimum: 0,
              default: 0,
              description: 'Starting index for pagination',
            },
          },
          required: ['query'],
        },
      },
    ];
  }

  private async handleSearchJiraTickets(args: any) {
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

  private async handleGetJiraTicket(args: any) {
    const { ticketKey } = args;
    
    if (!ticketKey) {
      throw new Error('ticketKey is required');
    }

    // Validate ticket key format
    const ticketKeyPattern = /^[A-Z]+-[0-9]+$/;
    if (!ticketKeyPattern.test(ticketKey)) {
      throw new Error('Invalid ticket key format. Expected format: PROJ-123');
    }

    const result = await this.jiraService.getTicketByKey(ticketKey);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchConfluenceContent(args: any) {
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
