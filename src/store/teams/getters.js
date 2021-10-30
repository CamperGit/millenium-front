export function getCurrentTeam(state) {
  return state.currentTeam;
}

export function getTeamCategories(state) {
  return state.categories;
}

export function getCreatePermission(state) {
  if (state.permissions) {
    return state.permissions.adding;
  }
  return false;
}

export function getChangingPermission(state) {
  if (state.permissions) {
    return state.permissions.changing;
  }
  return false;
}

export function getDeletingPermission(state) {
  if (state.permissions) {
    return state.permissions.deleting;
  }
  return false;
}

export function getModeratingPermission(state) {
  if (state.permissions) {
    return state.permissions.moderating;
  }
  return false;
}
