#!/usr/bin/env node

import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

async function testConfluenceAPI() {
  console.log('🔍 Testing Confluence API Directly');
  console.log('==================================');

  const baseUrl = process.env.CONFLUENCE_BASE_URL!.replace(/\/$/, '');
  const auth = {
    username: process.env.CONFLUENCE_EMAIL!,
    password: process.env.CONFLUENCE_API_TOKEN!,
  };

  // Test 1: Search with DEVOPS space filter
  console.log('\n📋 Test 1: Search with DEVOPS space filter');
  const cql1 = 'text ~ "kong" AND space.key = "DEVOPS" AND type = "page"';
  console.log('CQL:', cql1);
  
  try {
    const response1 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        cql: cql1,
        limit: 5,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response1.data.results.length} results in DEVOPS space`);
    response1.data.results.forEach((page: any, index: number) => {
      console.log(`  ${index + 1}. ${page.title} (Space: ${page.space?.key || 'unknown'})`);
    });
  } catch (error) {
    console.log('Error with DEVOPS search:', error);
  }

  // Test 2: Search without space filter
  console.log('\n📋 Test 2: Search without space filter');
  const cql2 = 'text ~ "kong" AND type = "page"';
  console.log('CQL:', cql2);
  
  try {
    const response2 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        cql: cql2,
        limit: 5,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response2.data.results.length} results across all spaces`);
    response2.data.results.forEach((page: any, index: number) => {
      console.log(`  ${index + 1}. ${page.title} (Space: ${page.space?.key || 'unknown'})`);
    });
  } catch (error) {
    console.log('Error with unfiltered search:', error);
  }

  // Test 3: Search with MVD space filter
  console.log('\n📋 Test 3: Search with MVD space filter');
  const cql3 = 'text ~ "kong" AND space.key = "MVD" AND type = "page"';
  console.log('CQL:', cql3);
  
  try {
    const response3 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        cql: cql3,
        limit: 5,
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response3.data.results.length} results in MVD space`);
    response3.data.results.forEach((page: any, index: number) => {
      console.log(`  ${index + 1}. ${page.title} (Space: ${page.space?.key || 'unknown'})`);
    });
  } catch (error) {
    console.log('Error with MVD search:', error);
  }
}

// Run the test
testConfluenceAPI().catch(console.error);
