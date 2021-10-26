export function setCurrentTeam(state, team) {
  state.currentTeam = team;
  state.categories = team.categories;
}

export function addCategory(state, category) {
  state.categories.push(category);
}
