# Atlassian MCP Server

A Model Context Protocol (MCP) server that provides integration with Atlassian Jira and Confluence. This server allows LLMs to interact with Jira tickets and Confluence pages through structured APIs.

## Features

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

The server provides the following tools:

### Jira Tools

#### `search_jira_tickets`
Search for Jira tickets with various filters.

**Parameters:**
- `assignee` (optional): Email of the assignee
- `creator` (optional): Email of the creator
- `createdAfter` (optional): ISO date string for tickets created after this date
- `createdBefore` (optional): ISO date string for tickets created before this date
- `project` (optional): Project key
- `status` (optional): Ticket status
- `maxResults` (optional): Maximum number of results (1-100, default: 50)
- `startAt` (optional): Starting index for pagination (default: 0)

#### `get_jira_tickets_by_assignee`
Get tickets assigned to a specific user.

**Parameters:**
- `assigneeEmail` (required): Email of the assignee
- `createdAfter` (optional): ISO date string
- `createdBefore` (optional): ISO date string
- `maxResults` (optional): Maximum results (default: 50)

#### `get_jira_tickets_by_creator`
Get tickets created by a specific user.

**Parameters:**
- `creatorEmail` (required): Email of the creator
- `createdAfter` (optional): ISO date string
- `createdBefore` (optional): ISO date string
- `maxResults` (optional): Maximum results (default: 50)

#### `get_jira_tickets_in_timeframe`
Get tickets created within a specific time frame.

**Parameters:**
- `startDate` (required): ISO date string for start of timeframe
- `endDate` (required): ISO date string for end of timeframe
- `maxResults` (optional): Maximum results (default: 50)

### Confluence Tools

#### `search_confluence_pages`
Search for Confluence pages based on text query.

**Parameters:**
- `query` (required): Text to search for in pages
- `spaceKey` (optional): Space key to limit search
- `type` (optional): 'page' or 'blogpost' (default: 'page')
- `limit` (optional): Maximum results (1-100, default: 25)
- `start` (optional): Starting index for pagination (default: 0)

#### `get_confluence_page_links`
Get direct links to Confluence pages matching a search query.

**Parameters:**
- `query` (required): Text to search for
- `spaceKey` (optional): Space key to limit search
- `limit` (optional): Maximum results (default: 25)

## Example Queries

### Jira Examples

```json
// Get all tickets assigned to john.doe@example.com
{
  "name": "get_jira_tickets_by_assignee",
  "arguments": {
    "assigneeEmail": "john.doe@example.com"
  }
}

// Get tickets created in January 2024
{
  "name": "get_jira_tickets_in_timeframe",
  "arguments": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.999Z"
  }
}

// Search for high priority bugs in the TEST project
{
  "name": "search_jira_tickets",
  "arguments": {
    "project": "TEST",
    "status": "Open",
    "maxResults": 25
  }
}
```

### Confluence Examples

```json
// Search for pages about "API documentation"
{
  "name": "search_confluence_pages",
  "arguments": {
    "query": "API documentation"
  }
}

// Get links to pages about "user guide" in the DOCS space
{
  "name": "get_confluence_page_links",
  "arguments": {
    "query": "user guide",
    "spaceKey": "DOCS",
    "limit": 10
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

### v1.0.0 (Initial Release)
- Jira ticket search and retrieval
- Confluence page search functionality
- Comprehensive test coverage
- Full MCP server implementation
- Documentation and examples
