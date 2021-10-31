import {stompClient} from "src/services/other/websocket";

class ExpenseService {
  createNewExpense(expense) {

    stompClient.send("/millenium/createExpense", {}, JSON.stringify(createExpenseObject(expense)));
  }

  editExpense(expense) {
    let payload = {...createExpenseObject(expense), expenseId : expense.editedExpenseId};
    console.log(payload)
    stompClient.send("/millenium/editExpense", {}, JSON.stringify(payload));
  }

  deleteExpense(expenseId) {
    stompClient.send("/millenium/deleteExpense", {}, expenseId)
  }
}

function createExpenseObject(expense) {
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
    maxPrice
  };
}

export default new ExpenseService();
