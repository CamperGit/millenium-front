import {api} from "boot/axios"
import {stompClient} from "src/services/other/websocket";
import {StompHeaders} from "@stomp/stompjs";

class CategoryService {
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
