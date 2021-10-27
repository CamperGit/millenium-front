import {api} from "boot/axios"
import authHeader from "src/services/auth/authHeader";

class TeamService {
  async createNewTeam(name, userId) {
    try {
      const {data} = await api.post("/teams", {}, {
        params: {
          name,
          userId
        },
        headers: authHeader()
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
