import {stompClient} from "src/services/other/websocket";
import {api} from "boot/axios";

class ExpenseService {
  async filter(filters) {
    const categoryId = filters.category.categoryId;
    const name = filters.filterByName ? filters.filterByName : null;
    const minPrice = filters.filterByMinPrice || filters.filterByMinPrice >= 0 ? filters.filterByMinPrice : null;
    const maxPrice = filters.filterByMaxPrice || filters.filterByMaxPrice > 0 ? filters.filterByMaxPrice : null;
    try {
      const {data} = await api.get("/expenses/filter",{
        params: {
          categoryId,
          name,
          minPrice,
          maxPrice
        },
      })
      return data;
    } catch (e) {
      throw e;
    }
  }

  createNewExpense(expense, teamId) {
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
