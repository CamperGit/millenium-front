import { boot } from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'
import authHeader from "src/services/auth/authHeader";

let stompClient = null;
const handlers = [];

export function addHandler(handler) {
  handlers.push(handler);
}

export function connect(user) {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(socket);
  if (user !== null) {
    const accessToken = user.accessToken;
    console.log(accessToken)
  }
  stompClient.connect(authHeader(), frame => {
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
  const currentUser = store.getters['auth/getCurrentUser'];
  if (currentUser) {
    connect(currentUser);
  }
})

export { stompClient };
