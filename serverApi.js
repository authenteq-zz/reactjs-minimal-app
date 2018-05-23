const axios = require('axios');

const API_ROOT = 'https://staging-api.authenteq.com';
const API_GET_USER_TOKEN = `${API_ROOT}/api/v1/claims/getUserToken`;
const API_VERIFY_CLAIM_ROOT = `${API_ROOT}/api/v1/claims`;
const API_KYC_ID_DOCUMENT = `${API_ROOT}/api/v1/kyc/getIdDocument`;
const API_KYC_AML = `${API_ROOT}/api/v1/kyc/getAmlCheck`;

const PARTNER_ID = process.env.AUTHENTEQ_PARTNER_ID;
const PARTNER_KEY = process.env.AUTHENTEQ_API_KEY;

const VALID_CLAIMS = [
  'givenname',
  'lastname',
  'dob',
  'nationality',
  'passportno',
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

function getAmlCheck(userTokenId) {
  return new Promise((resolve, reject) => {

    const url = API_KYC_AML;
    const payload = createPayload({
      userToken: userTokenId,
    });

    axios.post(url, payload).then((response) => {
      console.log(`getAmlCheck(${userTokenId})`, response.data);
      const { data } = response;

      if (data && !data.error) {
        resolve(data.data);
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

function getIdDocument(tokenId) {
  return new Promise((resolve, reject) => {

    const url = API_KYC_ID_DOCUMENT;
    const payload = createPayload({
      userToken: tokenId,
    });

    axios.post(url, payload, { responseType: 'stream' }).then((response) => {
      const { data } = response;

      if (data && !data.error) {
        let imageBuffer = Buffer.from('');

        data.on('data', (chunk) => {
          imageBuffer = Buffer.concat([imageBuffer, chunk])
        });

        data.on('end', () => {
          resolve(imageBuffer);
        });
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
  getAmlCheck,
  getIdDocument,
  verifyClaim,
}
