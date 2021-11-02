import {api} from "boot/axios"

class PermissionService {
  async getUserPermissionInTeam(userId, teamId) {
    const {data} = await api.get("/permissions", {
      params: {
        teamId,
        userId,
      },
    });
    return data;
  }

  async editUserPermissions(permissions, teamId) {
    const array = [];
    for (let permission of permissions) {
      array.push(permission.permissions);
    }
    await api.post("/permissions/edit/" + teamId, array, {});
  }

  async deleteUserFromTeam(permission) {
    await api.delete("/permissions", {
      params: {
        teamId : permission.teamId,
        userId : permission.userId,
      },
    })
  }
}

export default new PermissionService();
