# RESPONSE

```json
{
  "issues": [
    {
      "id": "10001", 
      "key": "PROJECT-123",
      "fields": {
        "summary": "Issue title",
        "description": {
          "type": "doc",
          "version": 1,
          "content": [...]  // Atlassian Document Format
        },
        "status": {
          "name": "In Progress",
          "statusCategory": {
            "key": "indeterminate",
            "name": "In Progress"
          }
        },
        "assignee": {
          "accountId": "abc123",
          "displayName": "John Doe",
          "emailAddress": "john@example.com"  // Optional
        },
        "creator": {
          "accountId": "def456", 
          "displayName": "Jane Smith"
          // emailAddress is missing
        },
        "reporter": {
          "accountId": "ghi789",
          "displayName": "Bob Wilson"
          // emailAddress is missing  
        },
        "created": "2024-01-01T10:00:00.000+0000",
        "updated": "2024-01-02T11:00:00.000+0000",
        "priority": {
          "name": "Medium",
          "id": "3"
        },
        "issuetype": {
          "name": "Task",
          "id": "10001"
        },
        "project": {
          "key": "PROJ",
          "name": "Project Name", 
          "id": "10000"
        }
      }
    }
  ],
  "startAt": 0,
  "maxResults": 50,
  "total": 150
}
```