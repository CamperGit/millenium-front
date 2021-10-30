import AuthService from '../../services/auth/authService';
import TokenService from '../../services/auth/tokenService'

export async function loginAction({ commit }, user) {
  try {
    const data = await AuthService.login(user);
    if (data) {
      const user = {username : data.username, email : data.email, id : data.id, roles : data.roles, teams : data.teams};
      const accessToken = {expirationTime : data.accessTokenExpiryAt, token : data.accessToken, type : data.tokenType};
      const refreshToken = {expirationTime: data.refreshTokenExpiryAt, token : data.refreshToken, type : data.tokenType};
      commit('setUser', user);
      commit('setAccessToken', accessToken);
      commit('setRefreshToken', refreshToken);
    }
    return true;
  } catch (e) {
    commit('logoutMutation');
    console.error(e);
    return false;
  }
}

export function logoutAction({ commit }) {
  commit('logoutMutation');
}

export async function registerAction({ commit }, user) {
  try {
    const data = await AuthService.register(user);
    return !!data;
  } catch (e) {
    console.log(e)
    return false;
  }
}

export async function refreshTokensAction({commit}, refreshToken) {
  try {
    const data = await TokenService.refreshTokens(refreshToken);
    const newAccessToken = {expirationTime : data.accessTokenExpiryAt, token : data.accessToken, type : data.tokenType};
    const newRefreshToken = {expirationTime: data.refreshTokenExpiryAt, token : data.refreshToken, type : data.tokenType};
    commit('setAccessToken', newAccessToken);
    commit('setRefreshToken', newRefreshToken);
    return true;
  } catch (e) {
    commit('logoutMutation');
    console.log(e);
    return false;
  }

}

export function addTeamAction({commit}, team) {
  commit('addTeamToUser', team)
}

export async function loadUserInfoAction({commit}) {
  try {
    const data = await AuthService.loadUserInfo();
    commit('loadUserInfo', data);
    return data;
  } catch (e) {
    throw e;
  }
}
