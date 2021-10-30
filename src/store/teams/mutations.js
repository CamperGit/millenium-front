import {getCategoryIndex} from "src/services/expenses/categoryService";
import {getExpenseIndex} from "src/services/expenses/expenseService";

export function setCurrentTeam(state, team) {
  state.currentTeam = team;
  state.categories = team.categories;
  state.selectedCategories.splice(0, state.selectedCategories.length);
  state.selectedCategories.push.apply(state.selectedCategories, state.categories);
}

export function updateCategories(state, newCategory) {
  if (newCategory) {
    const index = getCategoryIndex(state.categories, newCategory.categoryId);
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

export function updateExpenses(state, newExpense) {
  if (newExpense) {
    let found = false;
    let categories = state.categories;
    let categoryIndex = getCategoryIndex(categories, newExpense.category.categoryId);
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
    const categoryIndex = getCategoryIndex(state.categories, expense.category.categoryId);
    if (categoryIndex !== -1) {
      let category = state.categories[categoryIndex];
      const expenseIndex = getExpenseIndex(category.expenses, expense.expenseId);
      if (expenseIndex !== -1) {
        category.expenses.splice(expenseIndex, 1);
      }
    }
    /*const categoryIndex = getCategoryIndex(state.categories, expense.categoryId);
    if (index !== -1) {
      state.categories.splice(index, 1);
    }*/
  }
}

export function setPermissions(state, permissions) {
  if (permissions) {
    state.permissions = permissions;
  }
}

