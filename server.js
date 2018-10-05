// Read variables in .env file. You should create your .env file and write
// following variables:
// AUTHENTEQ_PARTNER_ID=<your Authenteq Partner ID>
// AUTHENTEQ_API_KEY=<your Authenteq API KEY>
require('dotenv').config()

if (process.env.AUTHENTEQ_PARTNER_ID === undefined || process.env.AUTHENTEQ_API_KEY === undefined) {
  console.error('Please create a file `.env` with following content:');
  console.error('AUTHENTEQ_PARTNER_ID=<your partner id>');
  console.error('AUTHENTEQ_API_KEY=<your API key>');
  process.exit(1);
}

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const serverApi = require('./serverApi');

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

  serverApi
    .verifyClaim(tokenId, claimType, value)
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

router.post('/getAmlCheck', (req, res) => {
  const {
    tokenId,
  } = req.body;

  serverApi
    .getAmlCheck(tokenId)
    .then((result) => {
      res.json({
        error: false,
        result,
      });
    })
    .catch((err) => {
      console.log(`ERROR /getAmlCheck/ {${tokenId}}`);
      console.log(err);

      res.json({
        error: true,
        errorMessage: 'AML check failed.',
      });
    });
});

router.post('/getIdDocument', (req, res) => {
  const {
    tokenId,
  } = req.body;

  serverApi
    .getIdDocument(tokenId)
    .then((imageBuffer) => {
      fs.writeFile(`./photo-${tokenId}.jpg`, imageBuffer, 'binary', (err) => {
        if (err) {
          console.log("ERROR: Couldn't write photo to local file");
        }
      });

      const encodedImage = imageBuffer.toString('base64');
      res.json({
        error: false,
        result: `data:image/jpg;base64,${encodedImage}`,
      });
    })
    .catch((err) => {
      console.log(`ERROR /getIdDocument/ ${tokenId}`);
      console.log(err);

      res.json({
        error: true,
        errorMessage: 'Retrieving ID Document failed.',
      });
    });
});

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}`));
