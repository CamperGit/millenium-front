import {api} from "boot/axios"
import authHeader from "src/services/auth/authHeader";

class ExpenseService {
  async createNewExpense(expense) {
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
    try {
      const {data} = await api.post("/expenses", {
        name: expense.expenseName,
        description,
        priority: expense.expensePriority,
        categoryId: expense.expenseCategory,
        fixedPrice,
        minPrice,
        maxPrice
      }, {});
      return data;
    } catch (e) {
      throw e
    }
  }
}

export default new ExpenseService();
