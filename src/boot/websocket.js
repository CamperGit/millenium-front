import {boot} from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'
import {addSubscription, connect, stompClient} from "src/services/other/websocket";
import EventBus from "src/common/eventBus";


export default boot(async ({store}) => {
  addSubscription({
    name: '/user/queue/categoriesUpdating', callback: (category) => {
      const value = JSON.parse(category.body);
      store.commit('teams/updateCategories', value)
    }
  });
  addSubscription({
    name: '/user/queue/deletedCategories', callback: (category) => {
      const value = JSON.parse(category.body);
      store.dispatch('teams/handleDeletedCategoryResponse', value);
    }
  });

  addSubscription({
    name: '/user/queue/expensesUpdating', callback: (expense) => {
      const value = JSON.parse(expense.body);
      store.commit('teams/updateExpenses', value);
    }
  });
  addSubscription({
    name: '/user/queue/deletedExpenses', callback: (expense) => {
      const value = JSON.parse(expense.body);
      store.commit('teams/deleteExpense', value);
    }
  });
  addSubscription({
    name: '/user/queue/updateTeamLimit', callback: (expense) => {
      const value = JSON.parse(expense.body);
      store.commit('teams/updateTeamLimit', value);
    }
  });
  addSubscription({
    name: '/user/queue/joinRequestUpdate', callback: (expense) => {
      const value = JSON.parse(expense.body);
      store.commit('teams/addUnreadTeamJoinRequest', value);
    }
  });
  addSubscription({
    name: '/user/queue/teamMessagesUpdate', callback: (expense) => {
      const value = JSON.parse(expense.body);
      console.log(value)
      store.commit('teams/addUnreadTeamMessage', value);
    }
  });

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
