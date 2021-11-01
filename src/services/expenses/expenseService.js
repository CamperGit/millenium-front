import {stompClient} from "src/services/other/websocket";

class ExpenseService {
  createNewExpense(expense, teamId) {
    console.log(expense)
    console.log(teamId)
    let payload = {...createExpenseObject(expense), teamId};
    stompClient.send("/millenium/createExpense", {}, JSON.stringify(payload));
  }

  editExpense(expense, teamId) {
    let payload = {...createExpenseObject(expense), expenseId : expense.editedExpenseId, teamId};
    stompClient.send("/millenium/editExpense", {}, JSON.stringify(payload));
  }

  deleteExpense(expenseId) {
    stompClient.send("/millenium/deleteExpense", {}, expenseId)
  }
}

function createExpenseObject(expense) {
  console.log(expense)
  let fixedPrice = expense.expenseFixedPrice;
  let minPrice = expense.expenseMinPrice;
  let maxPrice = expense.expenseMaxPrice;
  const priceType = expense.expensePriceType;
  if (priceType === 'fixed') {
    minPrice = null;
    maxPrice = null;
  } else {
    fixedPrice = null;
  }
  const description = expense.expenseDescription.length !== 0 ? expense.expenseDescription : null;

  return {
    name: expense.expenseName,
    description,
    priority: expense.expensePriority,
    categoryId: expense.expenseCategory,
    fixedPrice,
    minPrice,
    maxPrice,
  };
}

export default new ExpenseService();
