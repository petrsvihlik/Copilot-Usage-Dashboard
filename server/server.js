const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Endpoint to exchange GitHub code for access token
app.post('/exchange-github-code', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    // Exchange code for token with GitHub
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    // Return the access token to the client
    return res.json(response.data);
  } catch (error) {
    console.error('Error exchanging GitHub code:', error.message);
    return res.status(500).json({ 
      error: 'Failed to exchange code for token',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`GitHub OAuth proxy server running on port ${PORT}`);
}); 