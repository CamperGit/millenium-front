import {getCategoryIndex} from "src/services/expenses/categoryService";

export function setCurrentTeam(state, team) {
  state.currentTeam = team;
  state.categories = team.categories;
  state.selectedCategories.push.apply(state.selectedCategories, state.categories);
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
  const index = getCategoryIndex(state.selectedCategories, category.categoryId);
  if (index !== -1) {
    state.selectedCategories.splice(index, 1);
  }
}

export function addCategoryToSelected(state, category) {
  if (category) {
    state.selectedCategories.push(category);
  }
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

