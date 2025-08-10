#!/usr/bin/env node

import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

async function testDifferentCQLPatterns() {
  console.log('🔍 Testing Different CQL Space Filter Patterns');
  console.log('===============================================');

  const baseUrl = process.env.CONFLUENCE_BASE_URL!.replace(/\/$/, '');
  const auth = {
    username: process.env.CONFLUENCE_EMAIL!,
    password: process.env.CONFLUENCE_API_TOKEN!,
  };

  const testPatterns = [
    'text ~ "kong" AND space.key = "DEVOPS" AND type = "page"',
    'text ~ "kong" AND space = "DEVOPS" AND type = "page"',
    'text ~ "kong" AND space.name = "DEVOPS" AND type = "page"',
    'text ~ "kong" AND spaceKey = "DEVOPS" AND type = "page"',
  ];

  for (let i = 0; i < testPatterns.length; i++) {
    const cql = testPatterns[i];
    console.log(`\n📋 Test ${i + 1}: ${cql}`);
    
    try {
      const response = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
        auth,
        params: {
          cql: cql,
          limit: 3,
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Found ${response.data.results.length} results`);
      if (response.data.results.length > 0) {
        console.log(`First result: ${response.data.results[0].title}`);
        // Try to get space info from the full response
        const firstPage = response.data.results[0];
        console.log('Space info:', firstPage.space);
      }
    } catch (error: any) {
      console.log('Error:', error.response?.data?.message || error.message);
    }
  }

  // Test without CQL, using space-key parameter directly
  console.log('\n📋 Test 5: Using space-key parameter instead of CQL');
  try {
    const response = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        'space-key': 'DEVOPS',
        limit: 3,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response.data.results.length} results using space-key parameter`);
    if (response.data.results.length > 0) {
      console.log(`First result: ${response.data.results[0].title}`);
      const firstPage = response.data.results[0];
      console.log('Space info:', firstPage.space);
    }
  } catch (error: any) {
    console.log('Error with space-key parameter:', error.response?.data?.message || error.message);
  }
}

// Run the test
testDifferentCQLPatterns().catch(console.error);
