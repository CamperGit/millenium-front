import {api} from "boot/axios"
import {stompClient} from "src/services/other/websocket";

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

  editTeamLimit(editRequest) {
    stompClient.send("/millenium/updateTeamLimit",{} , JSON.stringify(editRequest));
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
