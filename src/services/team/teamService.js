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

  async sendJoinRequest(link, userId) {
    try {
      const {data} = await api.get("/teams/join", {
        params: {
          inviteLink : link,
          userId
        },
      });
      return data;
    } catch (e) {
      throw e
    }
  }
}

export default new TeamService();
