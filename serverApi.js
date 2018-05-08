const axios = require('axios');

const API_ROOT = 'https://staging-api.authenteq.com';
const API_GET_USER_TOKEN = `${API_ROOT}/api/v1/claims/getUserToken`;
const API_VERIFY_CLAIM_ROOT = `${API_ROOT}/api/v1/claims`;

const PARTNER_ID = 'ynKF89';
const PARTNER_KEY = '45KBODY8TwWAFjHjG1Da8h92C26n23EB';

const VALID_CLAIMS = [
  'givenname',
  'lastname',
  'dob',
  'nationality',
  'idnumber',
  'eighteenplus',
];

function createPayload(data) {
  return Object.assign({}, {
    partnerId: PARTNER_ID,
    apiKey: PARTNER_KEY,
  }, data);
}

function getUserToken(tokenId) {
  return new Promise((resolve, reject) => {
    const payload = createPayload({ tokenId });

    axios.post(API_GET_USER_TOKEN, payload)
      .then((response) => {
        // console.log('getUserToken', response);

        if (response.data && response.data.data && response.data.data.token) {
          resolve(response.data.data.token);
        } else {
          resolve(null);
        }
      })
      .catch((err) => reject(err));
  });
}

function verifyClaim(userTokenId, claimType, value) {
  return new Promise((resolve, reject) => {
    if (!VALID_CLAIMS.includes(claimType)) {
      const error = new Error(`verifyClaim::claimType '${claimType}' not supported`);
      reject(error);
    }

    if (value === null || value === undefined) {
      resolve(false);
      return;
    }

    const url = `${API_VERIFY_CLAIM_ROOT}/${claimType}`;
    const payload = createPayload({
      userToken: userTokenId,
      value,
    });

    axios.post(url, payload).then(({ data }) => {
      console.log(`verifyClaim(${userTokenId}, ${claimType}, ${value})`, data);

      if (data && !data.error) {
        const claimResult = data.claim;
        resolve(claimResult);
      } else {
        const error = new Error(data.message);
        reject(error);
      }
    })
    .catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  getUserToken,
  verifyClaim,
}
