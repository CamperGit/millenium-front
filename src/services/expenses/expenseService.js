import {api} from "boot/axios"
import {stompClient} from "src/services/other/websocket";

class ExpenseService {
  createNewExpense(expense) {
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
    stompClient.send("/millenium/createExpense",{} , JSON.stringify({
      name: expense.expenseName,
      description,
      priority: expense.expensePriority,
      categoryId: expense.expenseCategory,
      fixedPrice,
      minPrice,
      maxPrice
    }));
  }

  editExpense(expense) {
    stompClient.send("/millenium/editExpense",{} , JSON.stringify(expense));
  }

  deleteExpense(expenseId) {
    stompClient.send("/millenium/deleteExpense", {}, expenseId)
  }
}

export function getExpenseIndex(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].expenseId === id) {
      return i;
    }
  }
  return -1;
}

export default new ExpenseService();
