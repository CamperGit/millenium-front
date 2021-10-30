<template>
  <q-page>
    <categories-drawer :is-showed="categoryDrawer"/>
    <q-card flat square class="row" style="height: 100%">
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
import { connect, isConnected} from "src/services/other/websocket";
import CategoryService from "src/services/expenses/CategoryService";
import ExpensesService from "src/services/expenses/expenseService";
import CategoriesDrawer from "components/CategoriesDrawer";

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
  components : {
    CategoriesDrawer,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const isCanCreate = computed(()=> store.getters['teams/getCreatePermission']);
    const isCanUpdate = computed(()=> store.getters['teams/getChangingPermission']);
    const isCanDeleting = computed(()=> store.getters['teams/getDeletingPermission']);
    const isCanModerating = computed(()=> store.getters['teams/getModeratingPermission']);

    const categoryDrawer = ref(true);
    const currentTeam = computed(()=> store.getters['teams/getCurrentTeam']);
    const categories = computed(() => store.getters['teams/getTeamCategories']);
    const selectedCategories = computed(()=> store.getters['teams/getSelectedTeamCategories']);

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
      ExpensesService.createNewExpense(expense);
    }

    watch(selectedExpenses, (val) => {
      console.log(val)
    })

    onMounted(async () => {
      const currentUser = store.getters['auth/getCurrentUser'];
      const accessToken = store.getters['auth/getAccessToken'];
      if (currentUser && accessToken) {
        if (!isConnected()) {
          console.log('connect')
          connect(accessToken);
        }
      } else {
        await router.push("/auth/login");
      }
      const teams = currentUser?.teams;
      if (teams && teams.length !== 0) {
        store.commit('teams/setCurrentTeam', teams[0]); // TODO: add team selecting
        await store.dispatch('teams/getUserPermissionInTeam', {userId : currentUser.id, teamId : currentTeam.value.teamId})
      } else {
        await router.push("/team/create");
      }
    })

    return {
      currentTeam,
      categories,
      selectedCategories,
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
