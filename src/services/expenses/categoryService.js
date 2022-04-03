import {stompClient} from "src/services/other/websocket";
import {api} from "boot/axios";

class CategoryService {
  async filterCategories(filters) {
    const name = filters.filterByName ? filters.filterByName : null;
    const minPrice = filters.filterByMinPrice || filters.filterByMinPrice >= 0 ? filters.filterByMinPrice : null;
    const maxPrice = filters.filterByMaxPrice || filters.filterByMaxPrice > 0 ? filters.filterByMaxPrice : null;
    try {
      const {data} = await api.get("/categories/filter",{
        params: {
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

  createNewCategory(name, teamId) {
    stompClient.send("/millenium/createCategory",{} , JSON.stringify({name, teamId}));
  }

  editCategory(category) {
    stompClient.send("/millenium/editCategory",{} , JSON.stringify(category));
  }

  deleteCategory(deleteRequest) {
    stompClient.send("/millenium/deleteCategory", {}, JSON.stringify(deleteRequest))
  }
}

export default new CategoryService();
