import TeamService from "src/services/team/teamService";
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

export async function getUserPermissionInTeam({commit}, {userId, teamId}) {
  try {
    const data = await PermissionService.getUserPermissionInTeam(userId, teamId);
    if (data) {
      commit('setPermissions', data)
      return data;
    }
  } catch (e) {
    console.log(e)
    throw e;
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

export function addSelectedCategoryAction({commit, state}, category) {
  if (state.selectedCategories.includes(category)) {
    commit('removeSelectedCategory', category);
  } else {
    if (state.selectedCategories.length === state.categories.length) {
      commit('selectAllCategories');
    } else {
      commit('addCategoryToSelected', category)
    }
  }
}

export function handleDeletedCategoryResponse({commit}, response) {
  commit('deleteCategory', response.deletedCategory)
  commit('removeSelectedCategory', response.deletedCategory)
  commit('updateCategories', response.emptyCategory)
}
