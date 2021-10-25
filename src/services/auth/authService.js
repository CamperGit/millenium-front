import { api } from "boot/axios";
import TokenService from "./tokenService";
import authHeader from "src/services/auth/authHeader";

class AuthService {
  async login(user) {
    try {
      const {data} = await api.post('/auth/signin', {
        username: user.username,
        password: user.password
      });
      if (data.accessToken) {
        TokenService.setUser(data)
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  logout() {
    TokenService.removeUser();
  }

  async register(user) {
    try {
      console.log(user)
      const {data} = await api.post("/auth/signup", {
        username: user.username,
        email: user.email,
        password: user.password,
      })
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getUserRolesById(userId) {
    try {
      const {data} = await api.get("/auth/userRoles?userId=" + userId.userId, {headers: authHeader()})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new AuthService();
