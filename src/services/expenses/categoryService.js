import {stompClient} from "src/services/other/websocket";

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

export function getCategoryIndex(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].categoryId === id) {
      return i;
    }
  }
  return -1;
}

export default new CategoryService();
