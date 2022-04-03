import TeamService from "src/services/team/teamService";
import ExpensesService from "src/services/expenses/expenseService";
import PermissionService from "src/services/team/permissionService"

export async function createNewTeam ( {commit}, {name, userId}) {
  try {
    return await TeamService.createNewTeam(name, userId);
  } catch (e) {
    console.log(e)
    throw e;
  }
}

export async function getTeamInvites({commit}, teamId) {
  try {
    const data = await TeamService.getTeamInvites(teamId);
    commit('setUnreadTeamJoinRequests', data);
  } catch (e) {
    console.log(e);
  }
}

export async function getTeamMessages({commit}, teamId) {

}

export async function getTeamPermissions({commit}, teamId) {
  try {
    const data = await TeamService.getTeamPermissions(teamId);
    if (data) {
      commit('setTeamPermissions', data)
      return data;
    }
  } catch (e) {
    console.log(e)
    throw e;
  }
}

export function setUserPermission({commit, state}, userId) {
  for (let permission of state.teamPermissions) {
    console.log({permId : permission.permissions.userId, userId})
    if (permission.permissions.userId === userId) {
      commit('setPermissions', permission)
    }
  }
}

export function setCurrentTeamAction({commit}, team) {
  commit('clearInfo');
  commit('setCurrentTeam', team)
  commit('setCategories', team.categories)
  commit('selectAllCategories');
}

export function readNotifications({commit}) {
  commit('readTeamJoins');
  commit('readTeamMessages');
}

export async function applyJoinRequest({commit}, request) {
  const state = await TeamService.applyJoinRequest(request.inviteId);
  commit('removeJoinRequest', request);
}

export async function denyJoinRequest({commit}, request) {
  const state = await TeamService.denyJoinRequest(request.inviteId);
  commit('removeJoinRequest', request);
}

export function addSelectedCategoryAction({dispatch, commit, state}, category) {
  if (state.selectedCategories.includes(category)) {
    commit('removeSelectedCategory', category);
  } else {
    dispatch('filterCategoryExpenses', category)
    if (state.selectedCategories.length === state.categories.length) {
      commit('selectAllCategories');
    } else {
      commit('addCategoryToSelected', category)
    }
  }
}

export async function filterCategoryExpenses({commit, state}, category) {
  const filteredExpenses = await ExpensesService.filter({
    ...state.expensesFilters,
    category
  });
  const updatedCategory = {
    ...category
  }
  updatedCategory.expenses = filteredExpenses;
  commit('updateCategories', updatedCategory);
}

export function handleDeletedCategoryResponse({commit}, response) {
  commit('deleteCategory', response.deletedCategory)
  commit('removeSelectedCategory', response.deletedCategory)
  commit('updateCategories', response.emptyCategory)
}
