#!/usr/bin/env node
declare class AtlassianMCPServer {
    private server;
    private jiraService;
    private confluenceService;
    constructor();
    private initializeServices;
    private setupHandlers;
    private getAvailableTools;
    private handleSearchJiraTickets;
    private handleGetJiraTicketsByAssignee;
    private handleGetJiraTicketsByCreator;
    private handleGetJiraTicketsInTimeframe;
    private handleSearchConfluencePages;
    private handleGetConfluencePageLinks;
    run(): Promise<void>;
}
export { AtlassianMCPServer };
