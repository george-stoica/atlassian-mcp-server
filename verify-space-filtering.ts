#!/usr/bin/env node

import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

async function verifySpaceFiltering() {
  console.log('🔍 Verifying Space Filtering with Space Info');
  console.log('============================================');

  const baseUrl = process.env.CONFLUENCE_BASE_URL!.replace(/\/$/, '');
  const auth = {
    username: process.env.CONFLUENCE_EMAIL!,
    password: process.env.CONFLUENCE_API_TOKEN!,
  };

  // Test 1: Get pages from DEVOPS space with space info
  console.log('\n📋 Test 1: DEVOPS space with expanded space info');
  try {
    const response1 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        'space-key': 'DEVOPS',
        limit: 5,
        'expand': 'space',
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response1.data.results.length} pages in DEVOPS space`);
    response1.data.results.forEach((page: any, index: number) => {
      console.log(`  ${index + 1}. "${page.title}" (Space: ${page.space?.name || page.space?.key || 'unknown'})`);
    });
  } catch (error: any) {
    console.log('Error:', error.response?.data?.message || error.message);
  }

  // Test 2: Search for "kong" in a known different space (MVD)
  console.log('\n📋 Test 2: MVD space pages (to verify different space)');
  try {
    const response2 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        'space-key': 'MVD',
        limit: 5,
        'expand': 'space',
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response2.data.results.length} pages in MVD space`);
    response2.data.results.forEach((page: any, index: number) => {
      console.log(`  ${index + 1}. "${page.title}" (Space: ${page.space?.name || page.space?.key || 'unknown'})`);
    });
  } catch (error: any) {
    console.log('Error:', error.response?.data?.message || error.message);
  }

  // Test 3: Search for "kong" in DEVOPS with expanded space info
  console.log('\n📋 Test 3: Search "kong" in DEVOPS with space info');
  try {
    const response3 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        cql: 'text ~ "kong" AND space.key = "DEVOPS" AND type = "page"',
        limit: 5,
        'expand': 'space',
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response3.data.results.length} kong-related pages in DEVOPS space`);
    response3.data.results.forEach((page: any, index: number) => {
      console.log(`  ${index + 1}. "${page.title}" (Space: ${page.space?.name || page.space?.key || 'unknown'})`);
    });
  } catch (error: any) {
    console.log('Error:', error.response?.data?.message || error.message);
  }

  // Test 4: Search for "kong" globally to see all spaces
  console.log('\n📋 Test 4: Search "kong" globally with space info');
  try {
    const response4 = await axios.get(`${baseUrl}/wiki/api/v2/pages`, {
      auth,
      params: {
        cql: 'text ~ "kong" AND type = "page"',
        limit: 10,
        'expand': 'space',
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Found ${response4.data.results.length} kong-related pages globally`);
    const spaceGroups: Record<string, string[]> = {};
    
    response4.data.results.forEach((page: any) => {
      const spaceKey = page.space?.key || 'unknown';
      if (!spaceGroups[spaceKey]) {
        spaceGroups[spaceKey] = [];
      }
      spaceGroups[spaceKey].push(page.title);
    });

    Object.entries(spaceGroups).forEach(([spaceKey, pages]) => {
      console.log(`  Space ${spaceKey}: ${pages.length} pages`);
      pages.forEach((title, index) => {
        console.log(`    ${index + 1}. "${title}"`);
      });
    });
  } catch (error: any) {
    console.log('Error:', error.response?.data?.message || error.message);
  }
}

// Run the test
verifySpaceFiltering().catch(console.error);
