<template>
  <q-page>
    <categories-drawer :is-showed="categoryDrawer"/>
    <q-card flat square class="row" style="height: 100%">
      <q-card flat square class="q-pa-md col-12" style="height: 100%">
<!--        style="display: table-cell;vertical-align: middle;text-align: center; width: 100%"-->
        <q-card-section class="q-ma-none q-pt-none row no-wrap items-center">
          <q-btn class="team-header-buttons" @click="categoryDrawer = !categoryDrawer" flat icon="menu"></q-btn>
          <q-btn flat no-caps @click="showStatistic = !showStatistic">
            <span v-if="showStatistic"><u>Скрыть статистику</u></span>
            <span v-else><u>Показать статистику</u></span>
          </q-btn>
          <q-space/>
          <span style="margin-right: 10px">
            {{ currentTeam.name }}
          </span>
          <q-btn icon="notifications" flat class="team-header-buttons"/>
          <q-btn icon="settings" flat class="team-header-buttons"/>

        </q-card-section>
        <q-card-section class="q-pa-none q-ma-none">
          <q-btn v-if="isCanCreate" label="Добавить" @click="expenseDialog = true"></q-btn>
        </q-card-section>
        <q-card-section class="col-12">
          <q-table
            title="Treats"
            :rows="selectedExpenses"
            :columns="expensesTableColumns"
            row-key="expenseId"
            :rows-per-page-options="[0]"
            hide-pagination
            wrap-cells
            :visible-columns="visibleColumns"
          >
            <template v-slot:body-cell-delete="props">
              <q-td :props="props" class="q-pa-none q-ma-none">
                <div class="q-pa-none q-ma-none">
                  <q-btn flat color="red-5" icon="delete" class="expense-table-buttons q-pa-none q-ma-none"
                         @click="deleteExpense(props.row)"></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-edit="props">
              <q-td :props="props" class="q-pa-none q-ma-none">
                <div class="q-pa-none q-ma-none">
                  <q-btn flat color="grey" icon="edit" class="expense-table-buttons q-pa-none q-ma-none"
                         @click="openEditDialog(props.row)"></q-btn>
                </div>
              </q-td>
            </template>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  style="color: rgba(25, 118, 210, 0.8); font-size: 15px; font-weight: 600"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:top class="q-pa-none">
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-card>

    <q-dialog v-model="expenseDialog" class="q-pa-none" position="standard">
      <q-card id="dialog-add-info-schedule" class="q-pa-sm" style="width: 410px">
        <q-card-section v-if="expenseEditMode" class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
          <h6 class="q-pa-none q-my-sm">Изменить статью расхода:</h6>
        </q-card-section>
        <q-card-section v-else class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
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
          <q-btn v-if="expenseEditMode" size="md" :disable="!isExpenseValid" style="width: 110px" no-caps
                 color="primary" label="Изменить"
                 @click="editExpense({expenseName, expenseDescription, expensePriority, expenseCategory, expenseFixedPrice,
                  expenseMinPrice, expenseMaxPrice, expensePriceType, editedExpenseId})" v-close-popup/>
          <q-btn v-else size="md" :disable="!isExpenseValid" style="width: 110px" no-caps
                 color="primary" label="Добавить"
                 @click="createNewExpense({expenseName, expenseDescription, expensePriority, expenseCategory,
            expenseFixedPrice,
            expenseMinPrice, expenseMaxPrice, expensePriceType})" v-close-popup/>
          <q-btn size="md" style="width: 110px;" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import {useRouter} from "vue-router";
import {useStore} from "vuex"
import {connect, isConnected} from "src/services/other/websocket";
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

function getPriorityLabelByValue(value) {
  for (let priority of priorityOptions) {
    if (priority.value === value) {
      return priority.label;
    }
  }
  return '';
}

const expensesTableColumns = [
  {
    name: 'name',
    label: 'Название',
    field: 'name',
    align: 'center',
    style: 'max-width: 250px;'
  },
  {
    name: 'description',
    label: 'Описание',
    field: 'description',
    align: 'center',
    style: 'max-width: 400px'
  },
  {
    name: 'date',
    label: 'Дата создания',
    field: (row) => {
      const date = new Date(row.date);
      return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " +
        date.getHours() + ":" + date.getMinutes();
    },
    align: 'center',
    style: 'max-width: 180px;',
    headerStyle: 'max-width: 180px;',
  },
  {
    name: 'price',
    label: 'Цена',
    field: (row) => {
      if (row.fixedPrice !== null) {
        return row.fixedPrice;
      } else {
        return 'От ' + row.minPrice + ' до ' + row.maxPrice;
      }
    },
    align: 'center',
    style: 'max-width: 200px;'
  },
  {
    name: 'priority',
    label: 'Приоритет',
    field: (row) => {
      return getPriorityLabelByValue(row.priority);
    },
    align: 'center',
    style: 'max-width: 170px;'
  },
  {
    name: 'category',
    label: 'Категория',
    field: (row) => {
      if (row.categoryName === 'EMPTY') {
        return 'Без категории'
      } else {
        return row.categoryName;
      }
    },
    align: 'center',
    style: 'max-width: 220px;'
  },
  {
    name: 'delete',
    align: 'center',
    style: 'width: 32px;max-width: 64px; padding: 7px 4px 7px 16px;',
    headerStyle: 'width: 32px;width: 64px; padding: 7px 4px 7px 16px;',

  },
  {
    name: 'edit',
    align: 'center',
    style: 'width: 32px;max-width: 64px; padding: 7px 16px 7px 4px;',
    headerStyle: 'width: 32px;max-width: 64px; padding: 7px 16px 7px 4px;',

  },
]

export default defineComponent({
  name: 'PageIndex',
  components: {
    CategoriesDrawer,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const showStatistic = ref(true);
    const isCanCreate = computed(() => store.getters['teams/getCreatePermission']);
    const isCanUpdate = computed(() => store.getters['teams/getChangingPermission']);
    const isCanDeleting = computed(() => store.getters['teams/getDeletingPermission']);
    const isCanModerating = computed(() => store.getters['teams/getModeratingPermission']);

    const categoryDrawer = ref(true);
    const currentTeam = computed(() => store.getters['teams/getCurrentTeam']);
    const categories = computed(() => store.getters['teams/getTeamCategories']);
    const selectedCategories = computed(() => store.getters['teams/getSelectedTeamCategories']);

    const expenseEditMode = ref(false);
    const editedExpenseId = ref(0);
    const expenseDialog = ref(false);
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

    const selectedExpenses = computed(() => {
      if (selectedCategories.value && selectedCategories.value.length !== 0) {
        let resultArray = [];
        for (let category of selectedCategories.value) {
          for (let expense of category.expenses) {
            let expenseObject = {...expense, categoryName: category.name}
            resultArray.push(expenseObject)
          }
        }
        return resultArray;
      } else {
        return [];
      }
    })

    const createNewExpense = (expense) => {
      ExpensesService.createNewExpense(expense);
    }

    const editExpense = (expense) => {
      ExpensesService.editExpense(expense);
    }

    const deleteExpense = (expense) => {
      ExpensesService.deleteExpense(expense.expenseId);
    }

    const getCategoryByName = (name) => {
      for (let category of categories.value) {
        if (category.name === name) {
          return category;
        }
      }
    }

    const clearExpenseDialogFields = () => {
      editedExpenseId.value = 0;
      expenseName.value = '';
      expenseDescription.value = '';
      expenseFixedPrice.value = 0.0;
      expenseMinPrice.value = 0.0;
      expenseMaxPrice.value = 0.0;
      expenseCategory.value = null;
      expensePriceType.value = 'fixed';
      expenseEditMode.value = false;
    }

    const openEditDialog = (expense) => {
      editedExpenseId.value = expense.expenseId;
      expenseName.value = expense.name;
      expenseDescription.value = expense.description !== null ? expense.description : '';
      expensePriority.value = expense.priority;
      expenseCategory.value = getCategoryByName(expense.categoryName).categoryId;
      if (expense.fixedPrice !== null) {
        expensePriceType.value = 'fixed';
        expenseFixedPrice.value = expense.fixedPrice;
      } else {
        expensePriceType.value = 'range';
        expenseMinPrice.value = expense.minPrice;
        expenseMaxPrice.value = expense.maxPrice;
      }
      expenseEditMode.value = true;
      expenseDialog.value = true;
    }

    const changeColumnsByPermissions = (columns, permission, state) => {
      for (let i = 0; i < columns.length; i++) {
        let column = columns[i];
        if (column === permission && !state) {
          columns.splice(i, 1);
          return;
        }
      }
      if (state) {
        columns.push(permission);
      }
    }

    const visibleColumns = computed(()=> {
      console.log('compute columns')
      let resultColumns = ['name', 'description', 'date', 'price','priority', 'category'];
      changeColumnsByPermissions(resultColumns, 'edit', isCanUpdate.value);
      changeColumnsByPermissions(resultColumns, 'delete', isCanDeleting.value);
      console.log(resultColumns)
      return resultColumns;
    })

    watch(expenseDialog, (val) => {
      if (!val && expenseEditMode.value) {
        clearExpenseDialogFields();
      }
    })

    watch(selectedExpenses, (val) => {
      console.log(val)
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
        await store.dispatch('teams/getUserPermissionInTeam', {
          userId: currentUser.id,
          teamId: currentTeam.value.teamId
        })
      } else {
        await router.push("/team/create");
      }
    })

    return {
      currentTeam,
      categories,
      selectedCategories,
      categoryDrawer,
      expenseDialog,
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
      expenseEditMode,
      editedExpenseId,
      expensesTableColumns,
      visibleColumns,
      showStatistic,
      editExpense,
      deleteExpense,
      openEditDialog,
      createNewExpense,
      clearExpenseDialogFields
    }
  }
})
</script>
<style scoped>
.expense-table-buttons {
  height: 32px;
  width: 32px;
}

.team-header-buttons {
  width: 36px;
  height: 36px
}
</style>
