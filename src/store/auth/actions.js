import AuthService from '../../services/auth/authService';

export async function loginAction({ commit }, user) {
  try {
    const data = await AuthService.login(user);
    commit('loginSuccessMutation', data);
    return data;
  } catch (e) {
    commit('loginFailureMutation');
    console.error(e);
    throw e;
  }
}

export function logoutAction({ commit }) {
  AuthService.logout();
  commit('logoutMutation');
}

export async function registerAction({ commit }, user) {
  try {
    const data = await AuthService.register(user);
    commit('registerSuccessMutation');
    return data;
  } catch (e) {
    commit('registerFailureMutation');
    throw e;
  }
}

export function refreshTokensAction({commit}, accessToken, refreshToken) {
  commit('refreshTokensMutation', accessToken, refreshToken)
}

export function addTeamAction({commit}, team) {
  commit('addTeamToUser', team)
}

export async function loadUserInfoAction({commit}) {
  const data = await AuthService.loadUserInfo();
  commit('loadUserInfo', data);
  return data;
}
