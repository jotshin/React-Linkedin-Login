var express = require('express');
var router = express.Router();
const request = require('superagent');
require('dotenv').config()

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('in callback!')
  
  requestAccessToken(req.query.code,req.query.state)
  .then((response) => {
    console.log('in access token response! token=', response.body.access_token)

    requestProfile(response.body.access_token)
    .then(response => {
      console.log(response.body)

      res.render('callback', { profile: response.body});
    })
    .catch((error) => {
      console.log('profile error', error.stack)
      res.send(`${error}`)
    })
  })
  .catch((error) => {
    console.log('token error', error.stack)
    res.send(`${error}`)
  })
});

function requestAccessToken(code,state) {
  console.log('posting for accessToken!')

  return request.post('https://www.linkedin.com/oauth/v2/accessToken')
    .send('grant_type=authorization_code')
    .send(`redirect_uri=${process.env.EXPRESS_APP_REDIRECT_URI}`)
    .send(`client_id=${process.env.EXPRESS_APP_CLIENT_ID}`)
    .send(`client_secret=${process.env.EXPRESS_APP_CLIENT_SECRET}`)
    .send(`code=${code}`)
    .send(`state=${state}`)
}

function requestProfile(token) {
  return request.get('https://api.linkedin.com/v2/me')
  .set('Authorization', `Bearer ${token}`)
}

module.exports = router;
