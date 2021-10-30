<template>
  <q-page>
    <q-card flat square class="row" style="height: 100%">
      <q-drawer
        v-model="categoryDrawer"
        elevated
        class="q-pa-none q-ma-none q-mr-sm"
        id="category-drawer"
      >
        <q-card flat style="height: 100%" square class="col-2">
          <q-card-section class=" q-pa-none q-py-sm row">
            <h6 class="q-px-none q-pl-md q-my-sm">Категории:</h6>
            <q-space/>
            <q-btn v-if="isCanCreate" flat size="md" icon="add" @click="addNewCategoryDialog = true"></q-btn>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-list class="text-primary q-pa-none">
              <q-separator/>
              <q-item clickable v-ripple
                      :active="(selectedCategories && categories && selectedCategories.length === categories.length)"
                      @click="selectAllCategories" class="q-py-sm categories-list-inactive"
                      active-class="categories-list-active">
                <q-item-section>Все</q-item-section>
                <q-space/>
                <q-item-section avatar>
                  <span class="category-count-icon">{{ numberOfExpenses }}</span>
                </q-item-section>
              </q-item>
              <q-separator/>
              <template v-for="category of categories" :key="category">
                <q-item clickable :active="isCategorySelected(category.categoryId)"
                        @click="addSelectedCategory(category)" class="categories-list-inactive"
                        active-class="categories-list-active" @mouseenter="focusedCategory = category" @mouseleave="focusedCategory = null">
                  <q-item-section>{{ category.name === 'EMPTY' ? 'Без категории' : category.name}}</q-item-section>
                  <q-space/>
                  <transition name="category-edit" v-if="category.name !== 'EMPTY'">
                    <q-item-section  v-if="focusedCategory === category" avatar >
                      <q-btn  class="category-edit-button" flat icon="edit" @click="openCategoryEditDialog(category); addSelectedCategory(category)"></q-btn>
                    </q-item-section>
                  </transition>
                  <q-item-section avatar>
                    <span class="category-count-icon">{{ category.expenses.length }}</span>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-card-section>
        </q-card>
      </q-drawer>
      <q-card flat square class="q-pa-md" style="height: 100%">
        <q-card-section class="row q-pa-none q-ma-none"
                        style="display: table-cell;vertical-align: middle;text-align: center;">
          <q-btn style="width: 36px; height: 36px" @click="categoryDrawer = !categoryDrawer" flat icon="menu"></q-btn>
          <span>{{ currentTeam.name }}</span>
        </q-card-section>
        <q-card-section class="q-pa-none q-ma-none">
          <q-btn v-if="isCanCreate" label="Добавить" @click="createNewExpenseDialog = true"></q-btn>
        </q-card-section>
        <q-card-section>
          <q-table
            title="Treats"
            :rows="selectedExpenses"
            row-key="name"
          />
        </q-card-section>
      </q-card>
    </q-card>

    <q-dialog v-model="addNewCategoryDialog" class="q-pa-none" position="standard">
      <q-card id="dialog-add-info-schedule" class="q-pa-sm" style="width: 410px">
        <q-card-section class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
          <h6 class="q-pa-none q-my-sm">Добавление категории:</h6>
        </q-card-section>
        <q-card-section class="q-mx-sm q-py-none">
          <q-input v-model="categoryName" label="Название (15 символов)"/>
        </q-card-section>
        <q-card-actions class="justify-center q-mt-md">
          <q-btn size="md" :disable="categoryName < 2 || categoryName.length > 15 || categoryName === 'EMPTY'" style="width: 110px" no-caps
                 color="primary" label="Добавить" @click="createNewCategory(categoryName)" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editCategoryDialog" class="q-pa-none" position="standard">
      <q-card id="dialog-add-info-schedule" class="q-pa-sm" style="width: 410px">
        <q-card-section class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
          <h6 class="q-pa-none q-my-sm">Изменение категории:</h6>
        </q-card-section>
        <q-card-section class="q-mx-sm q-py-none">
          <q-input v-model="categoryEditName" label="Название (15 символов)"/>
        </q-card-section>
        <q-card-actions class="justify-center q-mt-md">
          <q-btn size="md" :disable="categoryEditName < 2 || categoryEditName.length > 15" style="width: 110px" no-caps
                 color="primary" label="Изменить" @click="editCategory(categoryEditName)" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
        <q-card-section class="justify-center q-pa-none q-ma-none " style="text-align: center">
          <q-btn style="width: 110px" color="red-5" @click="deleteCategoryDialog = true" no-caps label="Удалить"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteCategoryDialog" class="q-pa-none" position="standard">
      <q-card id="dialog-add-info-schedule" class="q-pa-sm" style="width: 410px; height: 238px">
        <q-card-section class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
          <span class="q-pa-none q-my-sm" style="font-size: 16px">Что сделать с расходами данной категории:</span>
        </q-card-section>
        <q-card-section class="q-mx-sm q-py-none q-pt-md">
          <q-radio v-model="categoryDeleteMode" val="save" label="Сохранить"/>
<!--          <q-card-section class="row justify-between">
          </q-card-section>-->
        </q-card-section>
        <q-card-section class="q-mx-sm q-py-none">
          <q-radio v-model="categoryDeleteMode" val="delete" label="Удалить"/>
        </q-card-section>
        <q-card-actions class="justify-center q-mt-sm q-mx-sm q-px-md">
          <q-btn size="md" style="width: 110px" no-caps
                 color="primary" label="Подтвердить" @click="deleteCategory(categoryDeleteMode)" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="createNewExpenseDialog" class="q-pa-none" position="standard">
      <q-card id="dialog-add-info-schedule" class="q-pa-sm" style="width: 410px">
        <q-card-section class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
          <h6 class="q-pa-none q-my-sm">Добавление нового расхода:</h6>
        </q-card-section>
        <q-card-section class="q-mx-sm q-py-none">
          <q-input v-model="expenseName" label="Название"/>
        </q-card-section>
        <q-card-section>
          <q-input v-model="expenseDescription"></q-input>
        </q-card-section>
        <q-card-section>
          <q-select v-model="expensePriority" label="Приоритет" :options="priorityOptions" emit-value
                    map-options></q-select>
        </q-card-section>
        <q-card-section>
          <q-select v-model="expenseCategory" :options="categories" option-label="name" option-value="categoryId"
                    map-options emit-value label="Категория">
          </q-select>
        </q-card-section>
        <q-card-section class="row justify-between">
          <q-radio v-model="expensePriceType" val="fixed" label="Фиксированная сумма"/>
          <q-radio v-model="expensePriceType" val="range" label="Диапазон"/>
        </q-card-section>
        <q-card-section v-if="expensePriceType === 'fixed'">
          <q-input v-model="expenseFixedPrice" type="number" label="Фиксированная сумма"></q-input>
        </q-card-section>
        <q-card-section v-else class="row">
          <q-input v-model="expenseMinPrice" type="number" label="От"></q-input>
          <q-input v-model="expenseMaxPrice" type="number" label="До"></q-input>
        </q-card-section>
        <q-card-actions class="justify-center q-mt-md">
          <q-btn size="md" :disable="!isExpenseValid" style="width: 110px" no-caps
                 color="primary" label="Добавить"
                 @click="createNewExpense({expenseName, expenseDescription, expensePriority, expenseCategory, expenseFixedPrice,
                  expenseMinPrice, expenseMaxPrice, expensePriceType})" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import {defineComponent, ref, computed, onMounted, watch} from 'vue';
import TeamService from "src/services/team/teamService";
import {useRouter} from "vue-router";
import {useStore} from "vuex"
import {addHandler, connect, isConnected} from "src/services/other/websocket";
import CategoryService from "src/services/expenses/CategoryService";

const priorityOptions = [
  {
    label: 'Очень низкий',
    value: 'VERY_LOW'
  },
  {
    label: 'Низкий',
    value: 'LOW'
  },
  {
    label: 'Средний',
    value: 'MEDIUM'
  },
  {
    label: 'Высокий',
    value: 'HIGH'
  },
  {
    label: 'Очень высокий',
    value: 'PRIMARY'
  },
]

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const router = useRouter();
    const store = useStore();

    const isCanCreate = computed(()=> store.getters['teams/getCreatePermission']);
    const isCanUpdate = computed(()=> store.getters['teams/getChangingPermission']);
    const isCanDeleting = computed(()=> store.getters['teams/getDeletingPermission']);
    const isCanModerating = computed(()=> store.getters['teams/getModeratingPermission']);

    const currentTeam = ref({});
    const addNewCategoryDialog = ref(false);
    const editCategoryDialog = ref(false);
    const deleteCategoryDialog = ref(false);
    const categoryDrawer = ref(true);
    const categoryName = ref('');
    const categories = ref([]);
    const selectedCategories = ref([]);
    const focusedCategory = ref({});
    const categoryEditId = ref(0);
    const categoryEditName = ref('');
    const categoryDeleteMode = ref('save')

    const isCategorySelected = (id) => {
      if (categories.value && selectedCategories.value) {
        if (categories.value.length === selectedCategories.value.length) {
          return false;
        }
        for (let category of selectedCategories.value) {
          if (category.categoryId === id) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    };

    const addSelectedCategory = (category) => {
      if (selectedCategories.value.includes(category)) {
        const index = selectedCategories.value.indexOf(category);
        if (index > -1) {
          selectedCategories.value.splice(index, 1);
        }
      } else {
        if (selectedCategories.value.length === categories.value.length) {
          selectAllCategories();
        } else {
          selectedCategories.value.push(category);
        }
      }
    }

    const selectAllCategories = () => {
      if (selectedCategories.value.length === categories.value.length) {
        selectedCategories.value.splice(0, selectedCategories.value.length);
      } else {
        selectedCategories.value.splice(0, selectedCategories.value.length);
        selectedCategories.value.push.apply(selectedCategories.value, categories.value);
      }
    }

    const numberOfExpenses = computed(() => {
      if (categories.value) {
        let counter = 0;
        for (let category of categories.value) {
          counter += category.expenses.length;
        }
        return counter;
      } else {
        return 0;
      }
    })

    const openCategoryEditDialog = (category) => {
      categoryEditName.value = category.name;
      categoryEditId.value = category.categoryId;
      editCategoryDialog.value = true;
    }

    const createNewCategory = (name) => {
      CategoryService.createNewCategory(name, currentTeam.value.teamId);
    }

    const editCategory = (newName) => {
      CategoryService.editCategory({id : categoryEditId.value, newName});
    }

    const deleteCategory = (mode) => {
      CategoryService.deleteCategory({id: categoryEditId.value, deleteExpenses: mode === 'delete'})
    }

    const createNewExpenseDialog = ref(false);
    const expenseName = ref('');
    const expenseDescription = ref('');
    const expensePriority = ref('MEDIUM');
    const expenseCategory = ref(null);
    const expenseFixedPrice = ref(0.0);
    const expenseMinPrice = ref(0.0);
    const expenseMaxPrice = ref(0.0);
    const expensePriceType = ref('fixed');

    const isExpenseValid = computed(() => {
      let valid = expenseName.value.length > 2 && expenseName.value.length <= 50;
      valid = valid && expenseDescription.value.length <= 1000;
      valid = valid && expenseCategory.value !== null;
      valid = valid && ((expensePriceType.value === 'range' && expenseMaxPrice.value - expenseMinPrice.value > 0)
        || (expensePriceType.value === 'fixed' && expenseFixedPrice.value >= 0));
      valid = valid && expenseMinPrice.value >= 0 && expenseMaxPrice.value >= 0;
      return valid;
    });

    const selectedExpenses = computed(()=> {
      if (selectedCategories.value && selectedCategories.value.length !== 0) {
        let resultArray = [];
        for (let category of selectedCategories.value) {
          resultArray.push.apply(resultArray, category.expenses);
        }
        return resultArray;
      } else {
        return [];
      }
    })

    const createNewExpense = async (expense) => {
      const data = await store.dispatch('teams/createNewExpense', expense);
    }

    watch(selectedExpenses, (val) => {
      //console.log(val)
    })

    onMounted(async () => {
      const currentUser = store.getters['auth/getCurrentUser'];
      const accessToken = store.getters['auth/getAccessToken'];
      if (currentUser && accessToken) {
        if (!isConnected()) {
          connect(accessToken);
        }
      } else {
        await router.push("/auth/login");
      }
      const teams = currentUser?.teams;
      if (teams && teams.length !== 0) {
        store.commit('teams/setCurrentTeam', teams[0]); // TODO: add team selecting
        currentTeam.value = store.getters['teams/getCurrentTeam'];
        categories.value = store.getters['teams/getTeamCategories'];
        selectedCategories.value.push.apply(selectedCategories.value, categories.value);
        await store.dispatch('teams/getUserPermissionInTeam', {userId : currentUser.id, teamId : currentTeam.value.teamId})
      } else {
        await router.push("/team/create");
      }
    })

    return {
      addNewCategoryDialog,
      editCategoryDialog,
      deleteCategoryDialog,
      categoryEditName,
      categoryDeleteMode,
      currentTeam,
      categoryName,
      categories,
      focusedCategory,
      selectedCategories,
      numberOfExpenses,
      categoryDrawer,
      createNewExpenseDialog,
      expenseName,
      expenseDescription,
      expensePriority,
      expenseCategory,
      expenseFixedPrice,
      expenseMinPrice,
      expenseMaxPrice,
      priorityOptions,
      isExpenseValid,
      expensePriceType,
      selectedExpenses,
      isCanCreate,
      isCanUpdate,
      isCanDeleting,
      isCanModerating,
      isCategorySelected,
      addSelectedCategory,
      createNewCategory,
      selectAllCategories,
      openCategoryEditDialog,
      editCategory,
      deleteCategory,
      createNewExpense
    }
  }
})
</script>
<style scoped>
#category-drawer {
  background-color: #F0F2F4;
  box-shadow: rgba(0, 0, 0, 0.15) 2.4px 0 3.2px;
  min-width: 182px
}

.category-count-icon {
  height: 32px;
  width: 32px;
  text-align: center;
  padding-top: 5px;
  color: black;
  background-color: rgb(229 229 229);
  border-radius: 3px
}

.categories-list-inactive {
  color: black;
}

.categories-list-active {
  color: white;
  background: rgba(25, 118, 210, 0.8);
}

.category-edit-enter-active,
.category-edit-leave-active {
  transition: opacity .5s
}

.category-edit-enter,
.category-edit-leave-to {
  opacity: 0
}

.category-edit-button {
  height: 32px;
  width: 32px;
  margin-right: -15px;
  transition-duration: 20s;
  transition: opacity .5s
}
</style>
