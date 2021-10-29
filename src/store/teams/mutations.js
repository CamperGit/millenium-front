export function setCurrentTeam(state, team) {
  for (let category of team.categories) {
    if (category.name === 'EMPTY') {
      category.name = 'Без категории'
      break;
    }
  }
  state.currentTeam = team;
  state.categories = team.categories;
}

export function addCategory(state, category) {
  state.categories.push(category);
}

export function addExpense(state, expense) {
  for (let category of state.categories) {
    if (category.categoryId === expense.category.categoryId) {
      category.expenses.push(expense);
      break;
    }
  }
}

export function setPermissions(state, permissions) {
  if (permissions) {
    state.permissions = permissions;
  }
}
