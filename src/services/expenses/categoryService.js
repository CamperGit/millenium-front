import {api} from "boot/axios"
import {stompClient} from "boot/websocket";
import {StompHeaders} from "@stomp/stompjs";

class CategoryService {
  async createNewCategory(name, teamId) {
    stompClient.send("/app/createCategory",{} , JSON.stringify({name, teamId}));
  }

  async getCategoryById(id) {
    const config = {
      params: {
        categoryId : id,
      },
    }
    try {
      return await api.get("/categories", config)
    } catch (e) {
      throw e
    }
  }


  /*async changeLessonsByNewValues(lessonsToChange, newValuesObj) {
    try {
      const {data} = await api.put("/categories",{
        lessonsToChange,
      });
      return data;
    } catch (e) {
      throw e;
    }
  }*/

  async deleteCategoryById(categoryId) {
    try {
      await api.delete("/categories/" + categoryId);
    } catch (e) {
      throw e;
    }
  }
}

export default new CategoryService();
