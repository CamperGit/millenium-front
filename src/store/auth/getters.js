export function getCurrentUser (state) {
  return state.user;
}

export function isLogged (state) {
  return !!state.user;
}

export function getAccessToken (state) {
  return state.accessToken;
}

export function getRefreshToken (state) {
  return state.refreshToken;
}
