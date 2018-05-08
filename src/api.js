import SockJS from 'sockjs-client';
import StompJS from 'stompjs';
import axios from 'axios';

const API_ROOT = 'https://staging-api.authenteq.com';
const API_LOGIN = `${API_ROOT}/login`;

export function verifyClaim(tokenId, claimType, value) {
  return new Promise((resolve, reject) => {
    if (value === null || value === undefined) {
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

export function connect(onConnect, onUserAuthenticate) {
  if (onConnect === undefined || onUserAuthenticate === undefined) {
    throw Error('Authenteq API::connect - both onConnect and onUserAuthenticate must be specified');
  }

  // console.log('Connecting using Stomp..');
  const stompClient = StompJS.over(new SockJS(API_LOGIN));

  // Don't print debug messages into console
  stompClient.debug = function() {};

  stompClient.connect({}, () => {

    stompClient.subscribe('/user/topic/authenticationId', (response) => {
      const data = JSON.parse(response.body);
      const sessionId = data.id;
      // console.log('API /user/topic/authenticationId', data);

      // Handle sessionId to app logic, so app can display a QR code
      onConnect(sessionId);

      stompClient.subscribe(`/topic/authenticate/${sessionId}`, (user) => {
        const tokenId = JSON.parse(user.body);
        console.log('API /topic/authenticate/', tokenId);

        // Handle tokenId back to app logic, so it can retrieve userTokenId.
        onUserAuthenticate(tokenId);
      });
    });

    stompClient.send('/app/loginNewBarcode');
  });
}
