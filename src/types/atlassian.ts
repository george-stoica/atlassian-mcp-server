export interface JiraTicket {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string | object | null;
    status: {
      name: string;
      statusCategory: {
        key: string;
        name: string;
      };
    };
    assignee?: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    } | null;
    creator?: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    };
    reporter?: {
      accountId: string;
      displayName: string;
      emailAddress?: string;
    };
    created: string;
    updated: string;
    priority?: {
      name: string;
      id: string;
    } | null;
    issuetype: {
      name: string;
      id: string;
    };
    project: {
      key: string;
      name: string;
      id: string;
    };
  };
}

export interface JiraSearchResult {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraTicket[];
}

export interface JiraSearchOptions {
  assignee?: string;
  creator?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  project?: string;
  status?: string | string[];
  team?: string;
  teamIdentifier?: string;
  summary?: string;
  description?: string;
  textSearch?: string;
  // New flexible search options
  textSearchTerms?: string[];
  summaryTerms?: string[];
  descriptionTerms?: string[];
  maxResults?: number;
  startAt?: number;
}

export interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  space: {
    id: string;
    key: string;
    name: string;
  };
  version: {
    number: number;
    when: string;
    by: {
      type: string;
      accountId: string;
      displayName: string;
    };
  };
  _links: {
    webui: string;
    self: string;
  };
  _expandable?: {
    container: string;
    metadata: string;
    operations: string;
    children: string;
    restrictions: string;
    history: string;
    ancestors: string;
    body: string;
    descendants: string;
  };
}

export interface ConfluenceSearchResult {
  results: ConfluencePage[];
  start: number;
  limit: number;
  size: number;
  _links: {
    base: string;
    context: string;
    self: string;
  };
}

export interface ConfluenceSearchOptions {
  query: string;
  spaceKey?: string;
  type?: 'page' | 'blogpost';
  limit?: number;
  start?: number;
}

export interface AtlassianConfig {
  jira: {
    baseUrl: string;
    email: string;
    apiToken: string;
  };
  confluence: {
    baseUrl: string;
    email: string;
    apiToken: string;
  };
}
