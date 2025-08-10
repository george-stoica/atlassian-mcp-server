# Atlassian MCP Server

A Model Context Protocol (MCP) server that provides integration with Atlassian Jira and Confluence. This server allows LLMs to interact with Jira tickets and Confluence pages through structured APIs.

## Overview

This MCP server integrates Atlassian Jira and Confluence, providing:
- JIRA ticket retrieval by assignee, creator, or date range
- Confluence page search
- Integration with Jira Cloud Platform REST APIs v3
- Integration with Confluence REST APIs v2

## MCP Tools

The server provides the following consolidated tools:

### Jira Tools

- `search_jira_tickets`: Unified search tool with comprehensive filtering options (assignee, creator, team, project, status, date ranges, flexible text search)
- `get_jira_ticket`: Retrieve a specific ticket by its key

### Confluence Tools

- `search_confluence_content`: Unified search tool with flexible output options (full details or links only)

## Architecture

### Project Structure
```
src/
├── services/           # Core service classes
│   ├── jira.ts        # Jira API client (strict types, Zod validation, error handling)
│   └── confluence.ts  # Confluence API client
├── types/             # TypeScript type definitions
│   └── atlassian.ts   # Atlassian API types
├── schemas/           # Zod validation schemas
│   └── atlassian.ts   # Input validation
├── __tests__/         # Unit tests (Jest)
│   ├── jira.test.ts
│   ├── confluence.test.ts
│   └── schemas.test.ts
└── index.ts           # MCP server entry point
```

### Key Components

- **JiraService** ([src/services/jira.ts](src/services/jira.ts)): Handles Jira API interactions, including ticket search by assignee, creator, and date range, with strict type checking and Zod validation.
- **ConfluenceService** ([src/services/confluence.ts](src/services/confluence.ts)): Manages Confluence API calls.
- **Schema Validation**: Uses Zod for input validation and type safety ([src/schemas/atlassian.ts](src/schemas/atlassian.ts)).
- **Error Handling**: Comprehensive error handling with meaningful messages.
- **Testing**: Full unit test coverage for all major functionality ([src/__tests__/](src/__tests__/)).

## Development

### Adding New Features

1. **Add new types** in [`src/types/atlassian.ts`](src/types/atlassian.ts)
2. **Create validation schemas** in [`src/schemas/atlassian.ts`](src/schemas/atlassian.ts)
3. **Implement service methods** in respective service classes
4. **Add MCP tool definitions** in [`src/index.ts`](src/index.ts)
5. **Write comprehensive tests** in [`src/__tests__/`](src/__tests__/)

### Code Quality

- **TypeScript**: Strict type checking enabled
- **Testing**: Jest with comprehensive unit tests
- **Validation**: Zod schemas for all inputs
- **Error Handling**: Proper error messages and HTTP status codes

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API tokens are correct
   - Check email addresses match Atlassian accounts
   - Ensure tokens have sufficient permissions

2. **Connection Issues**
   - Verify base URLs are correct
   - Check network connectivity
   - Confirm Atlassian instance is accessible

3. **Query Errors**
   - Validate JQL syntax for Jira queries
   - Check CQL syntax for Confluence searches
   - Ensure project keys and space keys exist

### Debug Mode

Run in development mode to see detailed error messages:
```bash
npm run dev
```

## Security Considerations

- Store API tokens securely (use environment variables)
- Never commit tokens to version control
- Use least-privilege API tokens
- Regularly rotate API tokens
- Monitor API usage and rate limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Changelog

### v1.0.0
- Jira ticket search and retrieval
- Confluence page search functionality
- Comprehensive test coverage
- Full MCP server implementation
- Documentation and examples

### Jira Integration
- **Search tickets by assignee** - Retrieve tickets assigned to specific users
- **Search tickets by creator** - Find tickets created by specific users  
- **Date-based filtering** - Filter tickets by creation date ranges
- **Time frame queries** - Get all tickets created within specific time periods
- **Advanced search** - Use multiple filters simultaneously (assignee, creator, project, status, dates)

### Confluence Integration
- **Page search** - Find pages by text content
- **Space filtering** - Limit searches to specific Confluence spaces
- **Page links** - Retrieve direct links to matching pages
- **Content type filtering** - Search for pages or blog posts

## Prerequisites

- Node.js (v16 or higher)
- TypeScript
- Atlassian Cloud instance with API access
- API tokens for Jira and Confluence

## Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd gst-atlassian-mcp
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Atlassian credentials:
```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token

CONFLUENCE_BASE_URL=https://your-domain.atlassian.net
CONFLUENCE_EMAIL=your-email@example.com
CONFLUENCE_API_TOKEN=your-confluence-api-token

# DevOps Space Configuration
DEVOPS_SPACE_KEY=DEVOPS
```

3. **Build the project:**
```bash
npm run build
```

## API Token Setup

### For Jira and Confluence Cloud:

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a descriptive label
4. Copy the generated token
5. Use your email address and the API token for authentication

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## MCP Tools

The server provides the following consolidated tools:

### Jira Tools

#### `search_jira_tickets`
Unified search tool with comprehensive filtering options for Jira tickets.

**Parameters:**
- `assignee` (optional): Email of the assignee
- `creator` (optional): Email of the creator
- `team` (optional): Team name (e.g., "Asia DevOps Team")
- `project` (optional): Project key
- `status` (optional): Single status or array of statuses
- `createdAfter` (optional): ISO date string for tickets created after this date
- `createdBefore` (optional): ISO date string for tickets created before this date
- `updatedAfter` (optional): ISO date string for tickets updated after this date
- `updatedBefore` (optional): ISO date string for tickets updated before this date
- `textSearch` (optional): Search text in both summary and description
- `summarySearch` (optional): Search text only in summary
- `descriptionSearch` (optional): Search text only in description
- `textSearchTerms` (optional): Array of terms with OR logic for summary and description
- `summaryTerms` (optional): Array of terms with OR logic for summary only
- `descriptionTerms` (optional): Array of terms with OR logic for description only
- `maxResults` (optional): Maximum number of results (1-100, default: 50)
- `startAt` (optional): Starting index for pagination (default: 0)

#### `get_jira_ticket`
Retrieve a specific Jira ticket by its key.

**Parameters:**
- `ticketKey` (required): Jira ticket key (e.g., "PROJ-123")

### Confluence Tools

#### `search_confluence_content`
Unified search tool for Confluence content in the DevOps space only.

**Parameters:**
- `query` (required): Text to search for in pages
- `type` (optional): 'page' or 'blogpost' (default: 'page')
- `outputFormat` (optional): 'full' or 'links_only' (default: 'full')
- `limit` (optional): Maximum number of results (1-100, default: 25)
- `start` (optional): Starting index for pagination (default: 0)

**Note:** All searches are automatically restricted to the DevOps space as configured by the `DEVOPS_SPACE_KEY` environment variable.

## Example Queries

### Jira Examples

```json
// Get all tickets assigned to john.doe@example.com
{
  "name": "search_jira_tickets",
  "arguments": {
    "assignee": "john.doe@example.com"
  }
}

// Get tickets created in January 2024
{
  "name": "search_jira_tickets",
  "arguments": {
    "createdAfter": "2024-01-01T00:00:00.000Z",
    "createdBefore": "2024-01-31T23:59:59.999Z"
  }
}

// Search for tickets by creator with date filtering
{
  "name": "search_jira_tickets",
  "arguments": {
    "creator": "jane.smith@example.com",
    "createdAfter": "2024-01-01",
    "maxResults": 25
  }
}

// Search for tickets containing "database" in summary or description
{
  "name": "search_jira_tickets",
  "arguments": {
    "textSearch": "database",
    "project": "BACKEND",
    "maxResults": 20
  }
}

// Search for "authentication" with advanced filters
{
  "name": "search_jira_tickets",
  "arguments": {
    "textSearch": "authentication",
    "project": "SECURITY",
    "status": "In Progress",
    "createdAfter": "2024-01-01",
    "maxResults": 30
  }
}

// Search specifically in ticket summaries for "bug fix"
{
  "name": "search_jira_tickets",
  "arguments": {
    "summarySearch": "bug fix",
    "project": "FRONTEND",
    "maxResults": 15
  }
}

// Search with multiple terms using OR logic
{
  "name": "search_jira_tickets",
  "arguments": {
    "textSearchTerms": ["performance", "optimization", "slow"],
    "project": "BACKEND",
    "status": ["To Do", "In Progress"]
  }
}

// Search by team and status
{
  "name": "search_jira_tickets",
  "arguments": {
    "team": "Asia DevOps Team",
    "status": ["To Do", "In Progress"],
    "maxResults": 50
  }
}

// Get a specific ticket by key
{
  "name": "get_jira_ticket",
  "arguments": {
    "ticketKey": "PROJ-123"
  }
}
```

### Confluence Examples

```json
// Search for pages about "API documentation" in DevOps space
{
  "name": "search_confluence_content",
  "arguments": {
    "query": "API documentation"
  }
}

// Get only links to pages about "user guide" in DevOps space
{
  "name": "search_confluence_content",
  "arguments": {
    "query": "user guide",
    "outputFormat": "links_only",
    "limit": 10
  }
}

// Search for blog posts about "release notes" in DevOps space
{
  "name": "search_confluence_content",
  "arguments": {
    "query": "release notes",
    "type": "blogpost",
    "limit": 15
  }
}
```

## Architecture

### Project Structure
```
src/
├── services/           # Core service classes
│   ├── jira.ts        # Jira API client
│   └── confluence.ts  # Confluence API client
├── types/             # TypeScript type definitions
│   └── atlassian.ts   # Atlassian API types
├── schemas/           # Zod validation schemas
│   └── atlassian.ts   # Input validation
├── __tests__/         # Unit tests
│   ├── jira.test.ts
│   ├── confluence.test.ts
│   └── schemas.test.ts
└── index.ts           # MCP server entry point
```

### Key Components

- **JiraService**: Handles all Jira API interactions using REST API v3
- **ConfluenceService**: Manages Confluence API calls using REST API v2
- **Schema Validation**: Uses Zod for input validation and type safety
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Testing**: Full unit test coverage for all major functionality

## Development

### Adding New Features

1. **Add new types** in `src/types/atlassian.ts`
2. **Create validation schemas** in `src/schemas/atlassian.ts`
3. **Implement service methods** in respective service classes
4. **Add MCP tool definitions** in `src/index.ts`
5. **Write comprehensive tests** in `src/__tests__/`

### Code Quality

- **TypeScript**: Strict type checking enabled
- **Testing**: Jest with comprehensive unit tests
- **Validation**: Zod schemas for all inputs
- **Error Handling**: Proper error messages and HTTP status codes

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API tokens are correct
   - Check email addresses match Atlassian accounts
   - Ensure tokens have sufficient permissions

2. **Connection Issues**
   - Verify base URLs are correct
   - Check network connectivity
   - Confirm Atlassian instance is accessible

3. **Query Errors**
   - Validate JQL syntax for Jira queries
   - Check CQL syntax for Confluence searches
   - Ensure project keys and space keys exist

### Debug Mode

Run in development mode to see detailed error messages:
```bash
npm run dev
```

## Security Considerations

- Store API tokens securely (use environment variables)
- Never commit tokens to version control
- Use least-privilege API tokens
- Regularly rotate API tokens
- Monitor API usage and rate limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

ISC License - see LICENSE file for details.

## Changelog

### v2.1.0 (DevOps Space Restriction)
- **BREAKING CHANGE**: Confluence searches now restricted to DevOps space only
- **Confluence Tools**:
  - Removed `spaceKey` parameter from `search_confluence_content` tool
  - All searches automatically filtered to DevOps space via `DEVOPS_SPACE_KEY` environment variable
  - Updated tool description to clarify DevOps space restriction
- **Configuration**:
  - Added `DEVOPS_SPACE_KEY` environment variable (defaults to "DEVOPS")
  - Updated error messages to include new environment variable requirement
- **Benefits**:
  - Simplified API by removing unnecessary parameter
  - Ensures consistent search scope for DevOps team
  - Improved security by restricting access to specific space

### v2.0.0 (Refactored Release)
- **BREAKING CHANGES**: Consolidated 9 tools into 3 unified tools
- **Jira Tools**: 
  - Replaced 7 redundant tools with single `search_jira_tickets` tool
  - Added new `get_jira_ticket` tool for single ticket retrieval
  - Enhanced text search with flexible options (summary-only, description-only, multiple terms with OR logic)
  - Improved team-based filtering
- **Confluence Tools**:
  - Consolidated 2 tools into single `search_confluence_content` tool
  - Added flexible output format (full details vs links only)
- **Benefits**:
  - 67% reduction in tool count (9 → 3)
  - Improved maintainability and consistency
  - Enhanced functionality with new search capabilities
  - Cleaner API surface

### v1.0.0 (Initial Release)
- Jira ticket search and retrieval
- Confluence page search functionality
- Comprehensive test coverage
- Full MCP server implementation
- Documentation and examples
