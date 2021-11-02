import {boot} from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'
import {addSubscription, connect, stompClient} from "src/services/other/websocket";
import EventBus from "src/common/eventBus";


export default boot(async ({store, router}) => {
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
    name: '/user/queue/updateTeamLimit', callback: (teamLimit) => {
      const value = JSON.parse(teamLimit.body);
      store.commit('teams/updateTeamLimit', value);
    }
  });
  addSubscription({
    name: '/user/queue/joinRequestUpdate', callback: (joinRequest) => {
      const value = JSON.parse(joinRequest.body);
      store.commit('teams/addUnreadTeamJoinRequest', value);
    }
  });
  addSubscription({
    name: '/user/queue/teamMessagesUpdate', callback: (teamMessage) => {
      const value = JSON.parse(teamMessage.body);
      store.commit('teams/addUnreadTeamMessage', value);
    }
  });
  addSubscription({
    name: '/user/queue/addNewUserToTeam', callback: (permissions) => {
      const value = JSON.parse(permissions.body);
      store.commit('teams/addNewUserToTeam', value);
    }
  });
  addSubscription({
    name: '/user/queue/updateTeamPermissions', callback: (permissions) => {
      const value = JSON.parse(permissions.body);
      store.commit('teams/setTeamPermissions', value);
    }
  });
  addSubscription({
    name: '/user/queue/deletedPermissions', callback: (permission) => {
      const value = JSON.parse(permission.body);
      store.commit('teams/removeUserFromTeam', value);
      const currentUserPermissions = store.getters['teams/getCurrentUserPermissions'];
      if (currentUserPermissions !== null) {
        if (currentUserPermissions.permissions.userId === value.userId && currentUserPermissions.permissions.teamId === value.teamId) {
          store.commit('teams/clearInfo');
          router.push('/team/create');
        }
      }
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
