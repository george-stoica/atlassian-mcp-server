#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { ConfluenceService } from './src/services/confluence';

// Load environment variables
dotenv.config();

async function searchKongPages() {
  console.log('🔍 Searching for Kong pages in DEVOPS space');
  console.log('=============================================');

  try {
    // Initialize Confluence service
    const confluenceService = new ConfluenceService(
      process.env.CONFLUENCE_BASE_URL!,
      process.env.CONFLUENCE_EMAIL!,
      process.env.CONFLUENCE_API_TOKEN!,
      process.env.DEVOPS_SPACE_KEY || 'DEVOPS'
    );

    console.log('✅ Confluence service initialized');

    // Search for pages containing "kong"
    console.log('\n🔍 Searching for pages containing "kong"...');
    
    const searchResult = await confluenceService.searchPages({
      query: 'kong',
      type: 'page',
      outputFormat: 'links_only',
      limit: 25, // Get more results to find all Kong-related pages
    });

    console.log(`\n📋 Results:`);
    
    if ((searchResult as any).links && (searchResult as any).links.length > 0) {
      console.log(`Found ${(searchResult as any).links.length} Kong-related pages:\n`);
      
      (searchResult as any).links.forEach((link: string, index: number) => {
        console.log(`${index + 1}. ${link}`);
      });
      
      console.log(`\n✅ Found ${(searchResult as any).links.length} Kong-related pages in DEVOPS space`);
    } else {
      console.log('❌ No pages found containing "kong" in the DEVOPS space');
    }

  } catch (error) {
    console.error('❌ Search failed:', error);
  }
}

// Run the search
searchKongPages().catch(console.error);
