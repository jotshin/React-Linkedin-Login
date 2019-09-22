var express = require('express');
var router = express.Router();
const request = require('superagent');
require('dotenv').config()

/* GET users listing. */
router.get('/', function(req, res, next) {
  requestAccessToken(req.query.code, req.query.state)
  .then((response) => {
    requestProfile(response.body.access_token)
    .then(response => {
      // sent to template engine
      res.render('callback', { profile: response.body});
    })
    .catch((error) => {
      res.send(`${error}`);
    })
  })
  .catch((error) => {
    res.send(`${error}`)
  })
});

function requestAccessToken(code,state) {

  return request.post('https://www.linkedin.com/oauth/v2/accessToken')
    .send('grant_type=authorization_code')
    .send(`redirect_uri=${process.env.EXPRESS_APP_REDIRECT_URI}`)
    .send(`client_id=${process.env.EXPRESS_APP_CLIENT_ID}`)
    .send(`client_secret=${process.env.EXPRESS_APP_CLIENT_SECRET}`)
    .send(`code=${code}`)
    .send(`state=${state}`)
}

function requestProfile(token) {
  // https://developer.linkedin.com/docs/ref/v2/profile/profile-picture
  // https://stackoverflow.com/questions/54484700/retrieving-the-profile-image-from-linkedin-api-response
  return request.get('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))')
  .set('Authorization', `Bearer ${token}`)
}

module.exports = router;
