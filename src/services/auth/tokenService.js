import {api} from "boot/axios";

class TokenService {
  async refreshTokens(refreshToken) {
    try {
      const {data} = await api.post("/auth/refreshtoken", {
        refreshToken,
      });
      return data;
    } catch (e) {
      console.log(e)
      throw e;
    }

  }
}

export function isTokenExpired(token) {
  if (token) {
    const expireDate = new Date(token.expirationTime);
    return expireDate < new Date();
  } else {
    return true;
  }
}

export default new TokenService();
