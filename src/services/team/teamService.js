import {api} from "boot/axios"
import {stompClient} from "src/services/other/websocket";

class TeamService {
  editTeamLimit(editRequest) {
    stompClient.send("/millenium/updateTeamLimit",{} , JSON.stringify(editRequest));
  }

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

  async applyJoinRequest(requestId) {
    try {
      await api.post("/teams/applyJoin", {}, {
        params: {
          inviteId : requestId,
        },
      });
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async denyJoinRequest(requestId) {
    try {
      await api.post("/teams/denyJoin", {}, {
        params: {
          inviteId : requestId,
        },
      });
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async getTeamInvites(teamId) {
    try {
      const {data} = await api.get("/teams/" + teamId +"/invites");
      return data;
    } catch (e) {
      console.log(e)
      throw e;
    }
  }

  async getTeamMessages(teamId) {
    try {
      const {data} = await api.get("/teams/" + teamId +"/messages");
      return data;
    } catch (e) {
      console.log(e)
      throw e;
    }
  }
}

export default new TeamService();
