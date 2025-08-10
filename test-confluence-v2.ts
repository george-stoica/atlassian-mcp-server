#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { ConfluenceService } from './src/services/confluence.js';

// Load environment variables
dotenv.config();

async function testConfluenceV2Implementation() {
  console.log('🧪 Testing Confluence API v2 Implementation');
  console.log('==========================================');

  try {
    // Initialize Confluence service
    const confluenceService = new ConfluenceService(
      process.env.CONFLUENCE_BASE_URL!,
      process.env.CONFLUENCE_EMAIL!,
      process.env.CONFLUENCE_API_TOKEN!,
      'DEVOPS' // Default space key
    );

    console.log('✅ Confluence service initialized');

    // Test 1: Connection test
    console.log('\n📡 Test 1: Testing connection...');
    const isConnected = await confluenceService.testConnection();
    console.log(`   Connection: ${isConnected ? '✅ Success' : '❌ Failed'}`);

    if (!isConnected) {
      console.log('❌ Cannot connect to Confluence API. Stopping tests.');
      return;
    }

    // Test 2: Basic search with minimal results
    console.log('\n🔍 Test 2: Basic search (limit 3)...');
    try {
      const searchResult = await confluenceService.searchPages({
        query: 'test',
        type: 'page',
        outputFormat: 'full',
        limit: 3,
      }) as any; // Cast to any for testing purposes

      console.log(`   Results found: ${searchResult.results?.length || 0}`);
      console.log(`   Response structure:`);
      console.log(`     - start: ${searchResult.start}`);
      console.log(`     - limit: ${searchResult.limit}`);
      console.log(`     - size: ${searchResult.size}`);
      console.log(`     - _links.next: ${searchResult._links?.next || 'undefined'}`);
      
      if (searchResult.results && searchResult.results.length > 0) {
        const firstPage = searchResult.results[0];
        console.log(`   First page structure:`);
        console.log(`     - id: ${firstPage.id}`);
        console.log(`     - title: ${firstPage.title}`);
        console.log(`     - status: ${firstPage.status}`);
        console.log(`     - spaceId: ${firstPage.spaceId}`);
        console.log(`     - parentId: ${firstPage.parentId}`);
        console.log(`     - parentType: ${firstPage.parentType}`);
        console.log(`     - authorId: ${firstPage.authorId}`);
        console.log(`     - createdAt: ${firstPage.createdAt}`);
        console.log(`     - space.id: ${firstPage.space?.id}`);
        console.log(`     - space.key: ${firstPage.space?.key}`);
        console.log(`     - space.name: ${firstPage.space?.name}`);
        console.log(`     - version.number: ${firstPage.version?.number}`);
        console.log(`     - version.when: ${firstPage.version?.when}`);
        console.log(`     - version.by.accountId: ${firstPage.version?.by.accountId}`);
        console.log(`     - _links.webui: ${firstPage._links.webui}`);
        console.log(`     - _links.editui: ${firstPage._links.editui}`);
      }

      console.log('   ✅ Basic search successful');
    } catch (error) {
      console.log(`   ❌ Basic search failed: ${error}`);
      console.log(`   Error details:`, error);
    }

    // Test 3: Search with links_only format
    console.log('\n🔗 Test 3: Links-only search...');
    try {
      const linksResult = await confluenceService.searchPages({
        query: 'documentation',
        type: 'page',
        outputFormat: 'links_only',
        limit: 2,
      });

      console.log(`   Links found: ${(linksResult as any).links?.length || 0}`);
      if ((linksResult as any).links && (linksResult as any).links.length > 0) {
        console.log(`   First link: ${(linksResult as any).links[0]}`);
      }
      console.log('   ✅ Links-only search successful');
    } catch (error) {
      console.log(`   ❌ Links-only search failed: ${error}`);
    }

    // Test 4: Search by text (convenience method)
    console.log('\n📝 Test 4: Search by text...');
    try {
      const textResult = await confluenceService.searchPagesByText('setup', 2);
      console.log(`   Pages found: ${textResult.results.length}`);
      console.log('   ✅ Search by text successful');
    } catch (error) {
      console.log(`   ❌ Search by text failed: ${error}`);
    }

    // Test 5: Get page links
    console.log('\n🔗 Test 5: Get page links...');
    try {
      const links = await confluenceService.getPageLinks('guide', 2);
      console.log(`   Links found: ${links.length}`);
      if (links.length > 0) {
        console.log(`   First link: ${links[0]}`);
      }
      console.log('   ✅ Get page links successful');
    } catch (error) {
      console.log(`   ❌ Get page links failed: ${error}`);
    }

    // Test 6: Schema validation test with raw API response
    console.log('\n🔬 Test 6: Raw API response inspection...');
    try {
      // Use reflection to access the private client
      const client = (confluenceService as any).client;
      const response = await client.get('/pages', { 
        params: { 
          cql: 'text ~ "test"',
          limit: 1 
        } 
      });

      console.log('   Raw API response structure:');
      console.log('   Response data keys:', Object.keys(response.data));
      
      if (response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        console.log('   First result keys:', Object.keys(firstResult));
        console.log('   First result sample data:');
        console.log(`     - id: ${firstResult.id}`);
        console.log(`     - status: ${firstResult.status}`);
        console.log(`     - title: ${firstResult.title?.substring(0, 50)}...`);
        console.log(`     - spaceId: ${firstResult.spaceId}`);
        console.log(`     - parentId: ${firstResult.parentId}`);
        console.log(`     - parentType: ${firstResult.parentType}`);
        console.log(`     - authorId: ${firstResult.authorId}`);
        console.log(`     - createdAt: ${firstResult.createdAt}`);
        
        if (firstResult._links) {
          console.log('   _links structure:', Object.keys(firstResult._links));
        }
        
        if (firstResult.version) {
          console.log('   version structure:', Object.keys(firstResult.version));
        }
      }

      if (response.data._links) {
        console.log('   Response _links structure:', Object.keys(response.data._links));
      }

      console.log('   ✅ Raw API response inspection successful');
    } catch (error) {
      console.log(`   ❌ Raw API response inspection failed: ${error}`);
    }

  } catch (error) {
    console.log('❌ Test setup failed:', error);
  }

  console.log('\n🏁 Confluence v2 testing complete!');
}

// Run the tests
testConfluenceV2Implementation().catch(console.error);
