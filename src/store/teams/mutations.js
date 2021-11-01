import {getIndexOfObject} from "src/services/other/tools";

export function toggleCategoryDrawer(state) {
  state.categoryDrawer = !state.categoryDrawer;
}

export function clearInfo(state) {
  state.currentTeam = null;
  state.teamLimit = null;
  state.permissions = {};
  state.categories = [];
  state.selectedCategories = [];
  state.teamInvites = [];
  state.teamMessages = [];
}

export function setCurrentTeam(state, team) {
  state.currentTeam = team;
}

export function setCategories(state, categories) {
  state.categories = categories;
}

export function removeJoinRequest(state, request) {
  let index = getIndexOfObject(state.readTeamInvites, 'limitId', request.limitId);
  if (index !== -1) {
    state.readTeamInvites.splice(index, 1);
  }
  index = getIndexOfObject(state.unReadTeamInvites, 'limitId', request.limitId);
  if (index !== -1) {
    state.unReadTeamInvites.splice(index, 1);
  }
}

export function setUnreadTeamJoinRequests(state, requests) {
  if (requests) {
    state.unReadTeamInvites = requests;
  }
}

export function addUnreadTeamJoinRequest(state, request) {
  state.unReadTeamInvites.push(request);
}

export function addUnreadTeamMessage(state, message) {
  state.unReadTeamMessages.push(message);
}

export function readTeamJoins(state) {
  let unReadJoins = state.unReadTeamInvites;
  state.readTeamInvites.push.apply(state.readTeamInvites, unReadJoins);
  unReadJoins.splice(0, unReadJoins.length);
}

export function readTeamMessages(state) {
  let unReadMessages = state.unReadTeamMessages;
  state.readTeamMessages.push.apply(state.readTeamMessages, unReadMessages);
  unReadMessages.splice(0, unReadMessages.length);
}

export function updateTeamLimit(state, updatedLimit) {
  if (updatedLimit) {
    let limits = state.currentTeam.limits;
    const index = getIndexOfObject(limits,'limitId', updatedLimit.limitId);
    if (index !== -1) {
      let limit = limits[index];
      limit.limit = updatedLimit.limit;
    } else {
      limits.push(updatedLimit);
      state.teamLimit = updatedLimit;
    }
  }
}

export function setTeamLimitByYearAndMonth(state, {year, month}) {
  let found = false;
  const limits = state.currentTeam.limits;
  for (let limit of limits) {
    if (limit.year === year && limit.month === month) {
      state.teamLimit = limit;
      found = true;
    }
  }
  if (!found) {
    state.teamLimit = null;
  }
}

export function updateCategories(state, newCategory) {
  if (newCategory) {
    const index = getIndexOfObject(state.categories,'categoryId', newCategory.categoryId);
    if (index !== -1) {
      let category = state.categories[index];
      category.name = newCategory.name;
      category.expenses = newCategory.expenses;
      //state.categories.splice(index, 1, newCategory);
    } else {
      state.categories.push(newCategory);
    }
  }
}

export function deleteCategory(state, deletedCategory) {
  const index = getIndexOfObject(state.categories,'categoryId', deletedCategory.categoryId);
  if (index !== -1) {
    state.categories.splice(index, 1);
  }
}

export function selectAllCategories(state) {
  if (state.selectedCategories.length === state.categories.length) {
    state.selectedCategories.splice(0, state.selectedCategories.length);
  } else {
    state.selectedCategories.splice(0, state.selectedCategories.length);
    state.selectedCategories.push.apply(state.selectedCategories, state.categories);
  }
}

export function removeSelectedCategory(state, category) {
  const index = getIndexOfObject(state.selectedCategories,'categoryId', category.categoryId);
  if (index !== -1) {
    state.selectedCategories.splice(index, 1);
  }
}

export function addCategoryToSelected(state, category) {
  if (category) {
    state.selectedCategories.push(category);
  }
}

export function updateExpenses(state, newExpense) {
  if (newExpense) {
    let found = false;
    let categories = state.categories;
    let categoryIndex = getIndexOfObject(categories,'categoryId', newExpense.category.categoryId);
    for (let category of categories) {
      let expenses = category.expenses;
      for (let i = 0; i < expenses.length; i++) {
        let expense = expenses[i];
        if (expense.expenseId === newExpense.expenseId) {
          found = true;
          expense.name = newExpense.name;
          expense.date = newExpense.date;
          expense.priority = newExpense.priority;
          expense.description = newExpense.description;
          expense.fixedPrice = newExpense.fixedPrice;
          expense.minPrice = newExpense.minPrice;
          expense.maxPrice = newExpense.maxPrice;
          if (category.categoryId !== newExpense.category.categoryId) {
            expenses.splice(i, 1);
            categories[categoryIndex].expenses.push(expense);
          }
          break;
        }
      }
    }
    if (!found && categoryIndex !== -1) {
      let category = categories[categoryIndex];
      category.expenses.push(newExpense);
    }
  }
}

export function deleteExpense(state, expense) {
  if (expense) {
    const categoryIndex = getIndexOfObject(state.categories,'categoryId', expense.category.categoryId);
    if (categoryIndex !== -1) {
      let category = state.categories[categoryIndex];
      const expenseIndex = getIndexOfObject(category.expenses,'expenseId', expense.expenseId);
      if (expenseIndex !== -1) {
        category.expenses.splice(expenseIndex, 1);
      }
    }
  }
}

export function setPermissions(state, permissions) {
  if (permissions) {
    state.permissions = permissions;
  }
}

