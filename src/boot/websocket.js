import { boot } from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'

let stompClient = null;
const handlers = [];

export function addHandler(handler) {
  handlers.push(handler);
}

function connect() {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, frame => {
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

export default boot(async (/* { app, router, ... } */) => {
  connect();
})

export { stompClient };
