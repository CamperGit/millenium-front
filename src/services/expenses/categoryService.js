import {api} from "boot/axios"
import authHeader from "src/services/auth/authHeader";
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
      },{headers: authHeader()});
      return data;
    } catch (e) {
      throw e;
    }
  }*/

  async deleteCategoryById(categoryId) {
    try {
      await api.delete("/categories/" + categoryId,{headers: authHeader()});
    } catch (e) {
      throw e;
    }
  }
}

export default new CategoryService();
