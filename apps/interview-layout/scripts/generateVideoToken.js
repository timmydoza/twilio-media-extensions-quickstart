const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env'), debug: true });
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_ROOM_NAME } = process.env;

// Create an access token which we will sign and return to the client,
// containing the grant we just created
const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET);
token.identity = 'Interview-Layout';

// Create a Video grant which enables a client to use Video
// and limits access to the specified Room (DailyStandup)
const videoGrant = new VideoGrant({
  room: TWILIO_ROOM_NAME,
});

// Add the grant to the token
token.addGrant(videoGrant);

// Serialize the token to a JWT string
module.exports = token.toJwt();
