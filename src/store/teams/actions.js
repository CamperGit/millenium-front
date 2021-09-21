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
