import { JiraTicket, JiraSearchResult, JiraSearchOptions } from '../types/atlassian';
export declare class JiraService {
    private client;
    private baseUrl;
    constructor(baseUrl: string, email: string, apiToken: string);
    /**
     * Search for Jira tickets based on the provided options
     */
    searchTickets(options: JiraSearchOptions): Promise<JiraSearchResult>;
    /**
     * Get tickets by assignee with optional date filtering
     */
    getTicketsByAssignee(assigneeEmail: string, createdAfter?: string, createdBefore?: string, maxResults?: number): Promise<JiraSearchResult>;
    /**
     * Get tickets by creator with optional date filtering
     */
    getTicketsByCreator(creatorEmail: string, createdAfter?: string, createdBefore?: string, maxResults?: number): Promise<JiraSearchResult>;
    /**
     * Get tickets created within a specific time frame
     */
    getTicketsInTimeframe(startDate: string, endDate: string, maxResults?: number): Promise<JiraSearchResult>;
    /**
     * Get a specific ticket by key
     */
    getTicketByKey(ticketKey: string): Promise<JiraTicket>;
    /**
     * Test the connection to Jira
     */
    testConnection(): Promise<boolean>;
}
