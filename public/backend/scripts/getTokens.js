const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
// Load environment variables
dotenv.config({ path: path.join(__dirname, '..') });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
  'http://localhost:3000/oauth2callback'  // Temporary redirect URL for token generation
);

// Generate auth URL
const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

// Create server to handle the OAuth2 callback
const server = http.createServer(async (req, res) => {
  try {
    const queryObject = url.parse(req.url, true).query;
    
    if (queryObject.code) {
      const { tokens } = await oauth2Client.getToken(queryObject.code);
      console.log('\nAdd these tokens to your environment configuration:\n');
      console.log(`GOOGLE_ACCESS_TOKEN=${tokens.access_token}`);
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      
      res.end('Success! You can close this window and check your console for the tokens.');
      server.close();
    }
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.end('Error getting tokens. Check your console.');
    server.close();
  }
});

server.listen(3000, () => {
  console.log('\nPlease visit this URL to authorize the application:');
  console.log(authUrl);
});
