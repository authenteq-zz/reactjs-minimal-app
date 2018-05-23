import SockJS from 'sockjs-client';
import StompJS from 'stompjs';
import axios from 'axios';

// const API_ROOT = 'https://staging-api.authenteq.com';
const PARTNER_ID = 'ynKF89';
const API_ROOT = 'https://staging-api.authenteq.com';
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
  const stompClient = StompJS.over(new SockJS(API_LOGIN));

  // Don't print debug messages into console
  // stompClient.debug = function() {};

  stompClient.connect({}, () => {

    stompClient.subscribe('/user/topic/authenticationId', (response) => {
      const data = JSON.parse(response.body);
      const sessionId = data.id;
      // console.log('API /user/topic/authenticationId', data);

      // Handle sessionId to app logic, so app can display a QR code
      onConnect(sessionId);

      stompClient.subscribe(`/topic/authenticate/${sessionId}`, () => {
        // const tokenId = JSON.parse(response2.body);
        // console.log('API /topic/authenticate/', tokenId);

        // Handle tokenId back to app logic, so it can retrieve tokenId.
        onUserAuthenticate(sessionId);
      });
    });

    stompClient.send('/app/partnerLogin', {}, JSON.stringify({
      partnerId: PARTNER_ID,
      scope,
    }));
  });
}
