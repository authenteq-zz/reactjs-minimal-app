import SockJS from 'sockjs-client';
import StompJS from 'stompjs';
import axios from 'axios';

const API_ROOT = 'https://staging-api.authenteq.com';
const API_LOGIN = `${API_ROOT}/login`;
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

function createAjaxPayload(data) {
  return Object.assign({}, {
    partnerId: PARTNER_ID,
    apiKey: PARTNER_KEY,
  }, data);
}

function getUserToken(tokenId, callback) {
  axios({
    method: 'POST',
    url: API_GET_USER_TOKEN,
    data: createAjaxPayload({ tokenId }),
  }).then((response) => {
    console.log('getUserToken::response', response);

    if (response.data && response.data.data && response.data.data.token) {
      callback(response.data.data.token);
    } else {
      callback(null);
    }
  });
}

export function verifyClaim(userTokenId, claimType, value) {
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
    const data = createAjaxPayload({
      userToken: userTokenId,
      value,
    });

    axios({
      method: 'POST',
      url,
      data,
    }).then((response) => {
      console.log(`verifyClaim(${userTokenId}, ${claimType}, ${value})`, response);

      if (response.data && !response.data.error) {
        const claimResult = response.data.claim;
        resolve(claimResult);
      } else {
        const error = new Error(response.data.error);
        reject(error);
      }
    });
  });
}

export function connect(onConnect, onUserAuthenticate, apiUrl = API_LOGIN) {
  if (onConnect === undefined || onUserAuthenticate === undefined) {
    throw Error('Authenteq API::connect - both onConnect and onUserAuthenticate must be specified');
  }

  console.log('Opening SockJS socket..');
  const socket = new SockJS(apiUrl);

  console.log('Connecting using Stomp..');
  const stompClient = StompJS.over(socket);

  stompClient.connect({}, (frame) => {
    console.log(`Connected: ${frame}`);

    stompClient.subscribe('/user/topic/authenticationId', (response) => {
      const data = JSON.parse(response.body);

      console.log('API /user/topic/authenticationId', data);
      onConnect(data);

      stompClient.subscribe(`/topic/authenticate/${data.id}`, (user) => {
        const tokenId = JSON.parse(user.body);
        console.log('API /topic/authenticate/', tokenId);

        // This should be implemented on backend, so we don't expose API keys
        getUserToken(tokenId, (userTokenId) => {
          onUserAuthenticate(userTokenId);
        });
      });
    });

    stompClient.send('/app/loginNewBarcode');
  });
}
