import { boot } from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'
import {addSubscription, connect, stompClient} from "src/services/other/websocket";


export default boot(async ( {store} ) => {
  addSubscription({ name : '/topic/categories', callback : (category) => {
      const value = JSON.parse(category.body);
      store.commit('teams/addCategory', value)
    }});
});
