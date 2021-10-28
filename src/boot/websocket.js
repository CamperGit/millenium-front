import { boot } from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'

let stompClient = null;
const handlers = [];

export function addHandler(handler) {
  handlers.push(handler);
}

export function connect(token) {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(socket);
  let accessToken = '';
  if (token !== null) {
    accessToken = 'Bearer ' + token;
    console.log(accessToken)
  }

  stompClient.connect({ Authorization: accessToken}, frame => {
    console.log('Connected: ' + frame);

    stompClient.subscribe('/topic/categories', category => {
      console.log(category)
      console.log(handlers)
      handlers.forEach(handler => handler(JSON.parse(category.body)));
    });
  });
}



function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log("Disconnected");
}

export default boot(async ( {store} ) => {
  const accessToken = store.getters['auth/getAccessToken'];
  if (accessToken) {
    connect(accessToken.token);
  }
})

export { stompClient };
