#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { ConfluenceService } from './src/services/confluence';

// Load environment variables
dotenv.config();

async function debugCQLQuery() {
  console.log('🔍 Debugging CQL Query Generation');
  console.log('=================================');

  try {
    // Initialize Confluence service
    const confluenceService = new ConfluenceService(
      process.env.CONFLUENCE_BASE_URL!,
      process.env.CONFLUENCE_EMAIL!,
      process.env.CONFLUENCE_API_TOKEN!,
      process.env.DEVOPS_SPACE_KEY || 'DEVOPS'
    );

    console.log('✅ Confluence service initialized');
    console.log(`Default DevOps space key: ${process.env.DEVOPS_SPACE_KEY || 'DEVOPS'}`);

    // Test case 1: Search with explicit DEVOPS space key
    console.log('\n📋 Test 1: Search with explicit DEVOPS space key');
    const options1 = {
      query: 'kong',
      spaceKey: 'DEVOPS',
      type: 'page' as const,
      outputFormat: 'links_only' as const,
      limit: 5,
    };
    
    const cql1 = confluenceService.debugCQLQuery(options1);
    console.log('Options:', JSON.stringify(options1, null, 2));
    console.log('Generated CQL:', cql1);
    
    // Test case 2: Search without space key (should default to DEVOPS)
    console.log('\n📋 Test 2: Search without space key (should default to DEVOPS)');
    const options2 = {
      query: 'kong',
      type: 'page' as const,
      outputFormat: 'links_only' as const,
      limit: 5,
    };
    
    const cql2 = confluenceService.debugCQLQuery(options2);
    console.log('Options:', JSON.stringify(options2, null, 2));
    console.log('Generated CQL:', cql2);

    // Test case 3: Search with different space key
    console.log('\n📋 Test 3: Search with different space key (MVD)');
    const options3 = {
      query: 'kong',
      spaceKey: 'MVD',
      type: 'page' as const,
      outputFormat: 'links_only' as const,
      limit: 5,
    };
    
    const cql3 = confluenceService.debugCQLQuery(options3);
    console.log('Options:', JSON.stringify(options3, null, 2));
    console.log('Generated CQL:', cql3);

    // Test case 4: Check if there's a real DEVOPS space by testing actual search
    console.log('\n📋 Test 4: Test actual search to see if DEVOPS space exists');
    try {
      const result = await confluenceService.searchPages({
        query: 'test',
        spaceKey: 'DEVOPS',
        type: 'page',
        outputFormat: 'full',
        limit: 1,
      });
      console.log('DEVOPS space search result:', result);
    } catch (error) {
      console.log('DEVOPS space search error:', error);
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug
debugCQLQuery().catch(console.error);
