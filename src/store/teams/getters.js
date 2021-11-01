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
