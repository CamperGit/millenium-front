export function logoutMutation(state) {
  state.loggedIn = false;
  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function setUser(state, user) {
  if (user) {
    state.user = user;
    state.loggedIn = true;
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    state.user = null;
    state.loggedIn = false;
    localStorage.removeItem("user");
  }
}

export function setAccessToken(state, accessToken) {
  if (accessToken) {
    state.accessToken = accessToken;
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
  } else {
    state.accessToken = null;
    localStorage.removeItem("accessToken");
  }
}

export function setRefreshToken(state, refreshToken) {
  if (refreshToken) {
    state.refreshToken = refreshToken;
    localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
  } else {
    state.refreshToken = null;
    localStorage.removeItem("refreshToken");
  }
}

export function addTeamToUser(state, team) {
  state.user.teams.push(team);
}

export function loadUserInfo(state, info) {
  state.user = {...state.user, teams : info.teams, roles : info.roles}
}
