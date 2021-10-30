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

  deleteExpense(deleteRequest) {
    stompClient.send("/millenium/deleteExpense", {}, JSON.stringify(deleteRequest))
  }
}

export default new ExpenseService();
