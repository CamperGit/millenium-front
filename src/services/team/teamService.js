import {api} from "boot/axios"

class TeamService {
  async createNewTeam(name, userId) {
    try {
      const {data} = await api.post("/teams", {}, {
        params: {
          name,
          userId
        },
      });
      return data;
    } catch (e) {
      throw e
    }
  }

  async getTeamById(id) {
    const config = {
      params: {
        teamId : id,
      },
    }
    try {
      return await api.get("/teams", config)
    } catch (e) {
      throw e
    }
  }
}

export default new TeamService();
