#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { ConfluenceService } from './src/services/confluence';

// Load environment variables
dotenv.config();

async function testSpaceFiltering() {
  console.log('🔍 Testing Fixed Space Filtering');
  console.log('===============================');

  try {
    // Initialize Confluence service
    const confluenceService = new ConfluenceService(
      process.env.CONFLUENCE_BASE_URL!,
      process.env.CONFLUENCE_EMAIL!,
      process.env.CONFLUENCE_API_TOKEN!,
      process.env.DEVOPS_SPACE_KEY || 'DEVOPS'
    );

    console.log('✅ Confluence service initialized');

    // Test 1: Get all pages from DEVOPS space (no search filter)
    console.log('\n📋 Test 1: All pages in DEVOPS space');
    try {
      const result1 = await confluenceService.searchPages({
        query: '', // Empty query to get all pages
        spaceKey: 'DEVOPS',
        type: 'page',
        outputFormat: 'full',
        limit: 10,
      });
      
      console.log('Result:', result1);
    } catch (error) {
      console.log('Error:', error);
    }

    // Test 2: Test with a simple query
    console.log('\n📋 Test 2: Search for "home" in DEVOPS space');
    try {
      const result2 = await confluenceService.searchPages({
        query: 'home',
        spaceKey: 'DEVOPS',
        type: 'page',
        outputFormat: 'links_only',
        limit: 5,
      });
      
      console.log('Result:', result2);
    } catch (error) {
      console.log('Error:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSpaceFiltering().catch(console.error);
