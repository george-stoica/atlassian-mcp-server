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
  type?: string; // Optional, derived in transformation
  status: string;
  title: string;
  
  // API v2 fields
  spaceId: string; // Direct field in v2
  parentId?: string | null; // Allow null in v2
  parentType?: string | null; // "page" typically, can be null
  position?: number | null; // Position in hierarchy, can be null
  authorId?: string; // Author account ID
  ownerId?: string; // Owner account ID  
  lastOwnerId?: string | null; // Last owner account ID, can be null
  subtype?: string; // Page subtype
  createdAt?: string; // ISO date string in v2
  
  // Transformed fields for unified interface
  space?: {
    id: string;
    key: string;
    name: string;
  };
  version?: {
    number: number;
    when: string;
    by: {
      type: string;
      accountId: string;
      displayName: string;
    };
    // v2 additional fields
    createdAt?: string;
    message?: string;
    minorEdit?: boolean;
    authorId?: string;
    ncsStepVersion?: number | null; // Can be null in v2
  };
  _links: {
    webui: string;
    self?: string;
    base?: string;
    // v2 additional links
    editui?: string;
    tinyui?: string;
  };
  body?: Record<string, any>;
  ancestors?: any[];
  
  // Extended v2 fields
  labels?: {
    results: Array<{
      id: string;
      name: string;
      prefix?: string;
    }>;
    meta: {
      hasMore: boolean;
      cursor?: string;
    };
    _links: {
      self: string;
    };
  };
  properties?: Record<string, any>;
  operations?: Record<string, any>;
  likes?: Record<string, any>;
  versions?: Record<string, any>;
  isFavoritedByCurrentUser?: boolean;
}

export interface ConfluenceSearchResult {
  results: ConfluencePage[];
  
  // v2 pagination with fallback values for backward compatibility
  start?: number;
  limit?: number;
  size?: number;
  
  _links: {
    context?: string;
    self?: string;
    base?: string;
    next?: string;
    prev?: string;
  };
}

export interface ConfluenceSearchOptions {
  query: string;
  spaceKey?: string;
  type?: 'page' | 'blogpost';
  outputFormat?: 'full' | 'links_only';
  limit?: number;
  cursor?: string; // v2 uses cursor-based pagination
}

export interface ConfluenceSearchLinksResult {
  links: string[];
  total: number;
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
