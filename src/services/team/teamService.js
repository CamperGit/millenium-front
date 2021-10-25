import {api} from "boot/axios"

class TeamService {
  async createNewTeam(name, userId) {
    try {
      return await api.post("/teams", {}, {
        params: {
          name,
          userId
        },
      })
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

  async testRequestBodyWithNumber(name, number) {

    try {
      return await api.post("/teams/test",{
        name,
        number
      })
    } catch (e) {
      throw e
    }
  }
}

export default new TeamService();
