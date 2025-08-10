const axios = require('axios');
require('dotenv').config();

async function debugConfluenceAPI() {
  const client = axios.create({
    baseURL: `${process.env.CONFLUENCE_BASE_URL}/wiki/api/v2`,
    auth: {
      username: process.env.CONFLUENCE_EMAIL,
      password: process.env.CONFLUENCE_API_TOKEN,
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  try {
    console.log('Testing Confluence API with search query: "kong deployment jarvis"');
    
    const params = {
      cql: 'text ~ "kong deployment jarvis" AND type = "page"',
      limit: 5,
      start: 0,
    };

    console.log('Request params:', params);
    
    const response = await client.get('/pages', { params });
    
    console.log('Response status:', response.status);
    console.log('Response data structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error details:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

debugConfluenceAPI();
