import SockJS from 'sockjs-client';
import StompJS from 'stompjs';
import axios from 'axios';

const PARTNER_ID = 'ynKF89';
const API_ROOT = 'https://api.authenteq.com';
const API_LOGIN = `${API_ROOT}/login`;

export function verifyClaim(tokenId, claimType, value) {
  return new Promise((resolve, reject) => {
    if (value === null || value === undefined || value === '') {
      resolve(false);
      return;
    }

    axios.post('/api/verifyClaim', {
      tokenId,
      claimType,
      value,
    }).then((response) => {
      console.log(`api.verifyClaim(${tokenId}, ${claimType}, ${value})`, response.data.result);

      if (!response.data.error) {
        resolve(response.data.result);
      } else {
        reject(response.data.errorMessage);
      }
    });
  });
}

export function getAmlCheck(tokenId) {
  return new Promise((resolve, reject) => {
    axios.post('/api/getAmlCheck', {
      tokenId,
    }).then((response) => {
      console.log(`api.getAmlCheck(${tokenId})`, response.data);

      if (!response.data.error) {
        resolve(response.data.result);
      } else {
        reject(response.data.errorMessage);
      }
    })
  });
}

export function getIdDocument(tokenId) {
  return new Promise((resolve, reject) => {
    axios.post('/api/getIdDocument', {
      tokenId,
    }).then((response) => {
      console.log(`api.getIdDocument(${tokenId})`, response.data);

      if (!response.data.error) {
        resolve(response.data.result);
      } else {
        reject(response.data.errorMessage);
      }
    })
  });
}

export function connect(onConnect, onUserAuthenticate, scope) {
  if (onConnect === undefined || onUserAuthenticate === undefined) {
    throw Error('Authenteq API::connect - both onConnect and onUserAuthenticate must be specified');
  }

  // console.log('Connecting using Stomp..');
  const socket = new SockJS(API_LOGIN);
  const stompClient = StompJS.over(socket);

  // Don't print debug messages into console
  // stompClient.debug = function() {};

  stompClient.connect({}, () => {
    const transportUrl = socket._transport.url; // eslint-disable-line no-underscore-dangle
    const sessionId = /\/([^/]+)\/websocket/.exec(transportUrl)[1];

    stompClient.subscribe(`/queue/${sessionId}.authenticationId`, (response) => {
      const data = JSON.parse(response.body);
      const tokenId = data.id;

      // Handle data to app logic, so app can display the AQR code
      // data = { id, svg }
      onConnect(data);

      stompClient.subscribe(`/topic/authenticate.${tokenId}`, () => {

        // Handle tokenId back to app logic
        onUserAuthenticate(tokenId);
      });
    });

    stompClient.send('/app/partnerLogin', {}, JSON.stringify({
      partnerId: PARTNER_ID,
      scope,
    }));
  });
}
