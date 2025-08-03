const { JiraService } = require('./dist/services/jira.js');

// Replace with your actual Jira credentials and base URL
const baseUrl = process.env.JIRA_BASE_URL || 'https://your-domain.atlassian.net';
const email = process.env.JIRA_EMAIL || 'your-email@example.com';
const apiToken = process.env.JIRA_API_TOKEN || 'your-api-token';

async function debugJiraResponse() {
  try {
    const jiraService = new JiraService(baseUrl, email, apiToken);
    
    // Make a raw request without schema validation
    const response = await jiraService.client.post('/search', {
      jql: 'assignee = "george.stoica@playstudios.asia"',
      startAt: 0,
      maxResults: 1,
      fields: [
        'summary',
        'description',
        'status',
        'assignee',
        'creator',
        'reporter',
        'created',
        'updated',
        'priority',
        'issuetype',
        'project',
      ],
      expand: ['renderedFields'],
    });

    console.log('Raw Jira Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.issues && response.data.issues.length > 0) {
      const firstIssue = response.data.issues[0];
      console.log('\nFirst issue fields:');
      console.log(JSON.stringify(firstIssue.fields, null, 2));
      
      console.log('\nDescription type:', typeof firstIssue.fields.description);
      console.log('Description value:', firstIssue.fields.description);
      
      if (firstIssue.fields.creator) {
        console.log('\nCreator fields:', Object.keys(firstIssue.fields.creator));
        console.log('Creator object:', firstIssue.fields.creator);
      }
      
      if (firstIssue.fields.reporter) {
        console.log('\nReporter fields:', Object.keys(firstIssue.fields.reporter));
        console.log('Reporter object:', firstIssue.fields.reporter);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

debugJiraResponse();
