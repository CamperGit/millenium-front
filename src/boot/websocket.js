import {boot} from 'quasar/wrappers'
import SockJS from 'sockjs-client'
import {Stomp} from '@stomp/stompjs'
import {addSubscription, connect, stompClient} from "src/services/other/websocket";
import EventBus from "src/common/eventBus";
import {filter} from "core-js/internals/array-iteration";


export default boot(async ({store, router}) => {
  const filterExpense = (expense) => {
    const filters = store.getters['teams/getExpensesFilters'];
    const selectedCategories = store.getters['teams/getSelectedTeamCategories'];
    return filterExpenseObject(filters, selectedCategories, expense);
  }

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
    name: '/user/queue/deletedExpenses', callback: (expense) => {
      const value = JSON.parse(expense.body);
      if (filterExpense(value)) {
        store.commit('teams/deleteExpense', value);
      }
    }
  });
  addSubscription({
    name: '/user/queue/expensesUpdating', callback: (expense) => {
      const value = JSON.parse(expense.body);
      if (filterExpense(value)) {
        store.commit('teams/updateExpenses', value);
      }
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

function filterExpenseObject (filters, selectedCategories, expense) {
  if (!filters) {
    return true;
  }

  const name = filters.filterByName ? filters.filterByName : null;
  const minPrice = filters.filterByMinPrice && filters.filterByMinPrice >= 0 ? filters.filterByMinPrice : null;
  const maxPrice = filters.filterByMaxPrice && filters.filterByMaxPrice > 0 ? filters.filterByMaxPrice : null;

  let filtered = true;
  if (name && !expense.name.match(new RegExp(name, 'g'))) {
    filtered = false;
  }

  if (minPrice) {
    const fixedPrice = expense.fixedPrice;
    const expenseMinPrice = expense.minPrice;
    if (fixedPrice && minPrice > fixedPrice) filtered = false
    if (expenseMinPrice && expenseMinPrice > minPrice) filtered = false
  }
  if (maxPrice) {
    const fixedPrice = expense.fixedPrice;

    const expenseMaxPrice = expense.maxPrice;
    if (fixedPrice && maxPrice < fixedPrice) filtered = false
    if (expenseMaxPrice && expenseMaxPrice < maxPrice) filtered = false
  }

  if (filters.filterByPriority && expense.priority && !filters.filterByPriority.includes(expense.priority)) return false;
  
  if (filters.filterByTopCreatedDate && filters.filterByTopCreatedDate < expense.date) return false;
  if (filters.filterByBottomCreatedDate && filters.filterByBottomCreatedDate > expense.date) return false;

  if (!selectedCategories.map(category => category.name).includes(expense.category.name)) filtered = false;

  return filtered;
}
