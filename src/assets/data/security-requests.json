{
  "categories": {
    "safe": {
      "name": "Safe Requests",
      "description": "Legitimate requests with no security concerns",
      "requests": [
        {
          "id": "safe_001",
          "source": "WikiSearch",
          "user": "ResearchUser",
          "content": "What are the system requirements for the new software?",
          "detected": [],
          "assessment": {
            "malicious": false,
            "risk": "LOW",
            "redactionRequired": false
          }
        },
        {
          "id": "safe_002", 
          "source": "HelpDesk",
          "user": "Employee123",
          "content": "How do I reset my password for the company portal?",
          "detected": [],
          "assessment": {
            "malicious": false,
            "risk": "LOW", 
            "redactionRequired": false
          }
        }
      ]
    },
    "pii": {
      "name": "PII Redaction Required",
      "description": "Requests containing personally identifiable information",
      "requests": [
        {
          "id": "pii_001",
          "source": "ContactForm",
          "user": "NewCustomer",
          "content": "Please contact me at john.doe@example.com or call 555-123-4567",
          "detected": [
            {"tag": "EMAIL", "count": 1},
            {"tag": "PHONE", "count": 1}
          ],
          "assessment": {
            "malicious": false,
            "risk": "MEDIUM",
            "redactionRequired": true
          }
        },
        {
          "id": "pii_002",
          "source": "SupportTicket", 
          "user": "CustomerABC",
          "content": "My API key is sk_live_abc123xyz789 and I need help integrating it",
          "detected": [
            {"tag": "API_KEY", "count": 1}
          ],
          "assessment": {
            "malicious": false,
            "risk": "HIGH",
            "redactionRequired": true
          }
        }
      ]
    },
    "malicious": {
      "name": "Malicious Requests",
      "description": "Requests containing security threats",
      "requests": [
        {
          "id": "mal_001",
          "source": "WebForm",
          "user": "AttackerX",
          "content": "'; DROP TABLE users; --",
          "detected": [
            {"tag": "SQLI", "count": 1}
          ],
          "assessment": {
            "malicious": true,
            "risk": "HIGH",
            "redactionRequired": false
          }
        },
        {
          "id": "mal_002",
          "source": "ChatInput",
          "user": "ScriptKiddie",
          "content": "<script>alert('XSS');</script>",
          "detected": [
            {"tag": "XSS", "count": 1}
          ],
          "assessment": {
            "malicious": true,
            "risk": "HIGH", 
            "redactionRequired": false
          }
        }
      ]
    }
  },
  "threatTypes": {
    "TOXICITY": "Offensive or harmful language",
    "EMAIL": "Email addresses",
    "PHONE": "Phone numbers", 
    "API_KEY": "API keys and tokens",
    "TOKEN": "Authentication tokens",
    "XSS": "Cross-site scripting attempts",
    "SQLI": "SQL injection attempts",
    "CMDI": "Command injection attempts"
  }
}