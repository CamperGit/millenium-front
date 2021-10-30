import TeamService from "src/services/team/teamService";
import PermissionService from "src/services/team/permissionService"
import {getCategoryIndex} from "src/services/expenses/categoryService";

export async function createNewTeam ( {commit}, {name, userId}) {
  try {
    const data = await TeamService.createNewTeam(name, userId);
    if (data) {
      commit('setCurrentTeam', data)
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
