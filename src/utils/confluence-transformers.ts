import { ConfluencePage, ConfluenceSearchResult } from '../types/atlassian';

/**
 * Transform Confluence API v2 response to unified format
 * Handles the differences between v2 API structure and our unified interface
 */
export function transformConfluenceV2Response(rawResponse: any): ConfluenceSearchResult {
  return {
    results: rawResponse.results.map((page: any) => transformConfluenceV2Page(page)),
    // v2 uses cursor pagination, so we provide fallback values
    start: 0, // v2 doesn't have start
    limit: rawResponse.results.length,
    size: rawResponse.results.length,
    _links: {
      context: rawResponse._links?.context || '',
      self: rawResponse._links?.base || '',
      base: rawResponse._links?.base,
      next: rawResponse._links?.next,
      prev: undefined, // v2 doesn't have prev
    },
  };
}

/**
 * Transform a single Confluence API v2 page to unified format
 */
export function transformConfluenceV2Page(page: any): ConfluencePage {
  return {
    id: page.id,
    type: 'page', // Default type for v2
    status: page.status,
    title: page.title,
    
    // v2 direct fields
    spaceId: page.spaceId,
    parentId: page.parentId,
    parentType: page.parentType,
    position: page.position,
    authorId: page.authorId,
    ownerId: page.ownerId,
    lastOwnerId: page.lastOwnerId,
    subtype: page.subtype,
    createdAt: page.createdAt,
    
    // Transform to unified space format (if we have spaceId)
    space: page.spaceId ? {
      id: page.spaceId,
      key: '', // Not provided in v2 basic response - would need separate call
      name: '', // Not provided in v2 basic response - would need separate call
    } : undefined,
    
    // Transform version info
    version: page.version ? {
      number: page.version.number,
      when: page.version.createdAt || page.createdAt,
      by: {
        type: 'user',
        accountId: page.version.authorId || page.authorId || '',
        displayName: '', // Not provided in v2 basic response
      },
      createdAt: page.version.createdAt,
      message: page.version.message,
      minorEdit: page.version.minorEdit,
      authorId: page.version.authorId,
    } : undefined,
    
    // Transform links
    _links: {
      webui: page._links.webui,
      self: page._links.editui,
      base: page._links.base,
      editui: page._links.editui,
      tinyui: page._links.tinyui,
    },
    
    body: page.body,
    ancestors: [], // Not typically provided in v2 basic response
    
    // v2 extended fields
    labels: page.labels,
    properties: page.properties,
    operations: page.operations,
    likes: page.likes,
    versions: page.versions,
    isFavoritedByCurrentUser: page.isFavoritedByCurrentUser,
  };
}

/**
 * Transform unified format back to API v2 compatible format
 * Useful for API calls that expect v2 format
 */
export function transformToConfluenceV2Format(unifiedPage: ConfluencePage): any {
  return {
    id: unifiedPage.id,
    status: unifiedPage.status || 'current',
    title: unifiedPage.title,
    spaceId: unifiedPage.spaceId || unifiedPage.space?.id,
    parentId: unifiedPage.parentId,
    parentType: unifiedPage.parentType || 'page',
    position: unifiedPage.position,
    authorId: unifiedPage.authorId || unifiedPage.version?.by.accountId,
    ownerId: unifiedPage.ownerId,
    lastOwnerId: unifiedPage.lastOwnerId,
    subtype: unifiedPage.subtype,
    createdAt: unifiedPage.createdAt || unifiedPage.version?.when,
    version: unifiedPage.version ? {
      createdAt: unifiedPage.version.createdAt || unifiedPage.version.when,
      number: unifiedPage.version.number,
      authorId: unifiedPage.version.authorId || unifiedPage.version.by.accountId,
      message: unifiedPage.version.message,
      minorEdit: unifiedPage.version.minorEdit,
    } : undefined,
    body: unifiedPage.body,
    _links: {
      webui: unifiedPage._links.webui,
      editui: unifiedPage._links.editui || unifiedPage._links.self,
      tinyui: unifiedPage._links.tinyui,
      base: unifiedPage._links.base,
    },
    labels: unifiedPage.labels,
    properties: unifiedPage.properties,
    operations: unifiedPage.operations,
    likes: unifiedPage.likes,
    versions: unifiedPage.versions,
    isFavoritedByCurrentUser: unifiedPage.isFavoritedByCurrentUser,
  };
}

/**
 * Detect if response looks like v2 format
 */
export function isV2Response(response: any): boolean {
  // v2 responses have spaceId directly and createdAt fields
  const firstResult = response.results?.[0];
  return firstResult && 
         (firstResult.spaceId !== undefined || firstResult.createdAt !== undefined) &&
         !firstResult.space; // v1 has nested space object
}
