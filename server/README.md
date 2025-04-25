# GitHub OAuth Proxy Server

This is a simple proxy server for handling the GitHub OAuth flow. It's required because GitHub OAuth requires a client secret for token exchange, which should never be included in frontend code.

## Setup

1. Create a `.env` file with the following contents:
```
# GitHub OAuth credentials
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Server port
PORT=3000
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000 (or the port specified in your .env file). 