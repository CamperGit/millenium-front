import {api} from "boot/axios"

class PermissionService {
  async getUserPermissionInTeam(userId, teamId) {
    try {
      const {data} = await api.get("/permissions", {
        params: {
          teamId,
          userId,
        },
      });
      return data;
    } catch (e) {
      throw e
    }
  }
}

export default new PermissionService();
