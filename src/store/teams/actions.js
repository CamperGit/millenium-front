import TeamService from "src/services/team/teamService";
import CategoryService from "src/services/expenses/CategoryService";
import ExpenseService from "src/services/expenses/expenseService";

export async function getTeamById ( {commit}, {teamId} ) {
  try {
    const data = await TeamService.getTeamById(teamId)
    commit('setCurrentTeam', data)
    return data;
  } catch (e) {
    throw e;
  }
}

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

export async function createNewCategory ({commit}, {name, teamId}) {
  try {
    const data = await CategoryService.createNewCategory(name, teamId);
    if (data) {
      commit('addCategory', data)
      return data;
    }
  } catch (e) {
    console.log(e)
    throw e;
  }
}

export async function createNewExpense ({commit}, expense) {
  try {
    const data = await ExpenseService.createNewExpense(expense);
    if (data) {
      commit('addExpense', data)
      return data;
    }
  } catch (e) {
    console.log(e)
    throw e;
  }
}
