import {api} from "boot/axios"

class TeamService {
  async createNewTeam(name, customNumber) {
    try {
      return await api.post("/teams?name=" + name + "&number=" + customNumber)
    } catch (e) {
      throw e
    }
  }

  async getTeamById(name, id) {
    const config = {
      params: {
        number : id,
        name
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
