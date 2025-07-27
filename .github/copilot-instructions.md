# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is an MCP (Model Context Protocol) server project for Atlassian Jira and Confluence integration.

You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

Additional documentation and examples: https://github.com/modelcontextprotocol/create-python-server

## Project Overview

This MCP server provides:
- JIRA ticket retrieval by assignee/creator with date filtering
- Confluence page search capabilities
- Integration with Jira Cloud Platform REST APIs v3
- Integration with Confluence REST APIs v2

## Development Guidelines

- Use TypeScript with strict type checking
- Implement comprehensive unit tests for all features
- Follow MCP SDK patterns and best practices
- Use Zod for schema validation
- Implement proper error handling and logging
- Use environment variables for API credentials
