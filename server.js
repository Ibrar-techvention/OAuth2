const express = require('express');
const axios = require('axios');
const app = express();
const { OAuth2Client } = require("google-auth-library");
const connection = require('./conn');


// UPS OAuth 2.0 credentials
const clientId = 'quPd4jZBdsjC1QrKdnB79uzFZOXfLGzA';
const clientSecret = 'Ehqbcx59KBeXbsfE';
const redirectUri = 'http://your-app.com/auth/callback';
const upsOAuthUrl = 'https://onlinetools.ups.com/rest/oauth2/authorize';
const upsTokenUrl = 'https://oauth2-provider.com/token';

// Middleware to initiate OAuth 2.0 flow
app.get('/auth', (req, res) => {
  const authUrl = `${upsOAuthUrl}?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    'response_type=code';
  console.log("🚀 ~ file: server.js:17 ~ app.get ~ authUrl:", authUrl)
  res.redirect(authUrl);
});
app.get('/login', async (req, res) => {
  try {
    const client = new OAuth2Client(
      "Ehqbcx59KBeXbsfE"
    );
    const ticket = await client.verifyIdToken({
      idToken: "quPd4jZBdsjC1QrKdnB79uzFZOXfLGzA",
    });
    const payload = ticket.getPayload();
    const userId = payload["sub"];
    console.log(`ID token verified for user ${userId}.`);
    return true;
  } catch (err) {
    console.error(`Error verifying ID token: ${err}`);
    return false;
  }
})
app.get('/', async (req, res) => {
  try {

    console.log(`app is running.`);
    return res.status(200).send("hlo working")
    return true;
  } catch (err) {
    console.error(`Error verifying ID token: ${err}`);
    return false;
  }
})


// Callback route to handle UPS OAuth 2.0 callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  console.log("🚀 ~ file: server.js:26 ~ app.get ~ code:", code)

  // Exchange the authorization code for access and refresh tokens
  try {
    const tokenResponse = await axios.post(upsTokenUrl, querystring.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("🚀 ~ file: server.js:40 ~ app.get ~ tokenResponse:", tokenResponse)

    const accessToken = tokenResponse.data.access_token;
    console.log("🚀 ~ file: server.js:42 ~ app.get ~ accessToken:", accessToken)
    res.send('Authentication successful. You can now make authenticated requests.');
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
});
app.get('/callback', async (req, res) => {
  const tokenEndpoint = 'https://oauth2-provider.com/token'

  const { code } = req.query

  const requestBody = {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: "http://localhost:3000"
  }

  const options = {
    method: 'POST',
    uri: tokenEndpoint,
    form: requestBody,
    json: true
  }

  try {
    const response = await request(options)
    console.log("response: " + response);
    req.session.accessToken = response.access_token
    req.session.refreshToken = response.refresh_token

    res.redirect('/user')

  } catch (err) {
    // console.log(err);
    res.send('Error retrieving access token')
  }
})
app.get("/oauth/redirect", (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  //   console.log("sasa: " + req.query.code);
  const clientId = 'quPd4jZBdsjC1QrKdnB79uzFZOXfLGzA';
  const clientSecret = 'Ehqbcx59KBeXbsfE';
  const requestToken = req.query.code;
  console.log("requestToken", requestToken);
  axios({
    // make a POST request
    method: "post",
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token;
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`);
  });
});

connection()
// Start your Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
