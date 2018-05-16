const express = require('express');
const bodyParser = require('body-parser');
const serverApi = require('./serverApi');

// Read variables in .env file. You should create your .env file and write
// following variables:
// AUTHENTEQ_PARTNER_ID=<your Authenteq Partner ID>
// AUTHENTEQ_API_KEY=<your Authenteq API KEY>
require('dotenv').config()

// Configure Express server
const app = express();
const port = process.env.PORT || 3001;
const router = express.Router();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.post('/verifyClaim', (req, res) => {
  const {
    tokenId,
    claimType,
    value,
  } = req.body;

  // console.log(req.body);

  // We call getUserToken for every verifyClaim request. As it's separate API
  // call, you should probably implement it in a way that it's called only once
  // for all claims that you want to perform. You can do that by either
  // implementing a 'verifyClaims' endpoint that would verify multiple claims
  // at once, or by caching this value on the server.
  //
  // This implementation is simply as a showcase
  serverApi
    .getUserToken(tokenId)
    .then((userTokenId) => serverApi.verifyClaim(userTokenId, claimType, value))
    .then((result) => {
      res.json({
        error: false,
        claimType,
        result,
      });
    })
    .catch((err) => {
      console.log(`ERROR /verifyClaim/ {${tokenId}, ${claimType}, ${value}}`);
      console.log(err);

      res.json({
        error: true,
        errorMessage: 'Claim verification failed.',
      });
    });
});

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}`));
