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
  // User/Role filters
  assignee?: string;
  creator?: string;
  team?: string;
  teamIdentifier?: string;
  
  // Project/Status filters
  project?: string;
  status?: string | string[];
  
  // Date filters
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  
  // Text search options
  textSearch?: string;
  summarySearch?: string;
  descriptionSearch?: string;
  textSearchTerms?: string[];
  summaryTerms?: string[];
  descriptionTerms?: string[];
  
  // Pagination
  maxResults?: number;
  startAt?: number;
}

export interface ConfluencePage {
  id: string;
  parentId: string | null;
  spaceId: string;
  ownerId: string;
  lastOwnerId: string | null;
  createdAt: string;
  authorId: string;
  parentType: string | null;
  status: string;
  title: string;
  position?: any | null;
  body?: {};
  version: {
    number: number;
    message: string;
    minorEdit: boolean;
    authorId: string;
    createdAt: string;
    ncsStepVersion?: any | null;
  };
  _links: {
    editui: string;
    webui: string;
    edituiv2: string;
    tinyui: string;
  };
}

export interface ConfluenceSearchResult {
  results: ConfluencePage[];
  _links: {
    next?: string;
    base: string;
  };
}

export interface ConfluenceSearchOptions {
  query: string;
  spaceKey?: string;
  type?: 'page' | 'blogpost';
  outputFormat?: 'full' | 'links_only';
  limit?: number;
  start?: number;
}

export interface ConfluenceSearchLinksResult {
  links: string[];
  total: number;
  start: number;
  limit: number;
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
