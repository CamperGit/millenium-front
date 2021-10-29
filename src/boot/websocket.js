import { boot } from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'
import {addSubscription, connect, stompClient} from "src/services/other/websocket";
import EventBus from "src/common/eventBus";



export default boot(async ( {store} ) => {
  addSubscription({ name : '/users/queue/categories', callback : (category) => {
      const value = JSON.parse(category.body);
      store.commit('teams/addCategory', value)
    }});
  console.log('add subscriptions')

  try {
    const accessToken = store.getters['auth/getAccessToken'];
    if (accessToken) {
      connect(accessToken);
    } else {
      EventBus.dispatch("logout");
    }
  } catch (e) {
    EventBus.dispatch("logout");
    console.log(e);
  }
});
