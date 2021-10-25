import TeamService from "src/services/team/teamService";

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
    commit('setCurrentTeam', data)
    return data;
  } catch (e) {
    throw e;
  }
}
