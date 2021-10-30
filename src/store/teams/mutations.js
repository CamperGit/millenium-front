export function setCurrentTeam(state, team) {
  state.currentTeam = team;
  state.categories = team.categories;
}

export function updateCategories(state, newCategory) {
  if (newCategory) {
    const index = getCategoryIndex(state.categories, newCategory.categoryId);
    if (index !== -1) {
      state.categories.splice(index, 1, newCategory);
    } else {
      state.categories.push(newCategory);
    }
  }
}

export function deleteCategory(state, deletedCategory) {
  const index = getCategoryIndex(state.categories, deletedCategory.categoryId);
  state.categories.splice(index, 1);
}

export function updateExpenses(state, expense) {
  console.log(expense)
  if (expense) {
    for (let category of state.categories) {
      if (category.categoryId === expense.category.categoryId) {
        category.expenses.push(expense);
        break;
      }
    }
  }
}

export function setPermissions(state, permissions) {
  if (permissions) {
    state.permissions = permissions;
  }
}

function getCategoryIndex(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].categoryId === id) {
      return i;
    }
  }
  return -1;
}
