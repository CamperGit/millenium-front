import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";

let stompClient = null;
const subscriptions = [];

export function addSubscription(subscription) {
  subscriptions.push(subscription);
}

export function isConnected() {
  return !!stompClient;
}

export function connect(accessToken) {
  if (accessToken !== null) {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    let token = accessToken.type + ' ' + accessToken.token;
    stompClient.connect({Authorization: token}, frame => {
      console.log('Connected: ' + frame);
      console.log(subscriptions)
      subscriptions.forEach(subscription => {
        stompClient.subscribe(subscription.name, subscription.callback)
      })
    });
    return true;
  } else {
    return false;
  }
}


export function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log("Disconnected");
}

export { stompClient };
