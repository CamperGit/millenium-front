export function loginSuccessMutation(state, user) {
  state.loggedIn = true;
  state.user = user;
}

export function loginFailureMutation(state) {
  state.loggedIn = false;
  state.user = null;
}

export function logoutMutation(state) {
  state.loggedIn = false;
  state.user = null;
}

export function registerSuccessMutation(state) {
  state.loggedIn = false;
}

export function registerFailureMutation(state) {
  state.loggedIn = false;
}

export function addTeamToUser(state, team) {
  state.user.teams.push(team);
}

export function refreshTokensMutation(state, accessToken, refreshToken) {
  state.loggedIn = true
  state.user = {...state.user, accessToken, refreshToken}
}


export function loadUserInfo(state, info) {
  state.user = {...state.user, teams : info.teams, roles : info.roles}
}
