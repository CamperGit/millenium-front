export function getCategoryDrawerState(state) {
  return state.categoryDrawer;
}

export function getTeamLimit(state) {
  return state.teamLimit;
}

export function getCurrentTeam(state) {
  return state.currentTeam;
}

export function getTeamCategories(state) {
  return state.categories;
}

export function getSelectedTeamCategories(state) {
  return state.selectedCategories;
}

export function getUnReadJoinsRequests(state) {
  return state.unReadTeamInvites;
}

export function getUnReadTeamMessages(state) {
  return state.unReadTeamMessages;
}

export function getReadJoinsRequests(state) {
  return state.readTeamInvites
}

export function getReadTeamMessages(state) {
  return state.readTeamMessages;
}

export function getTeamUsersPermissions(state) {
  return state.teamPermissions;
}

export function getCreatePermission(state) {
  if (state.currentUserPermissions) {
    return state.currentUserPermissions.adding;
  }
  return false;
}

export function getChangingPermission(state) {
  if (state.currentUserPermissions) {
    return state.currentUserPermissions.changing;
  }
  return false;
}

export function getDeletingPermission(state) {
  if (state.currentUserPermissions) {
    return state.currentUserPermissions.deleting;
  }
  return false;
}

export function getModeratingPermission(state) {
  if (state.currentUserPermissions) {
    return state.currentUserPermissions.moderating;
  }
  return false;
}
