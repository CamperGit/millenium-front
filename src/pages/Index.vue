<template>
  <q-page>
    <categories-drawer/>
    <q-card flat square class="row q-pr-none" style="height: 100%">
      <q-card flat square class="col-12 q-py-md q-pl-md q-pr-none" style="height: 100%">
        <q-card-section class="q-ma-none q-pt-none row no-wrap items-center">
          <q-btn class="team-header-buttons" @click="toggleCategoryDrawer" flat icon="menu"></q-btn>
          <q-btn flat no-caps @click="showStatistic = !showStatistic">
            <span v-if="showStatistic"><u>Скрыть статистику</u></span>
            <span v-else><u>Показать статистику</u></span>
          </q-btn>
          <q-space/>
          <q-btn no-caps flat @click="teamSelectDialog = true">
            <u>Сменить рабочее пространство</u>
          </q-btn>
          <q-btn icon="notifications" flat class="team-header-buttons" @click="notificationsDialog = true">
            <q-badge v-if="numberOfUnreadMessages !== 0" color="red" floating>{{ numberOfUnreadMessages }}</q-badge>
          </q-btn>
          <q-btn v-if="isCanModerating" icon="settings" flat class="team-header-buttons"/>
        </q-card-section>
        <q-slide-transition :duration="800">
          <div v-show="showStatistic">
            <q-card-section class="row q-pt-md q-col-gutter-x-xl q-col-gutter-y-lg">
              <div class="col-md-6 col-lg-3">
                <q-card bordered class="stats-card shadow-1">
                  <q-card-section class="q-ma-md q-pa-none row no-wrap">
                    <div class="stats-icon-div row justify-center items-center shadow-8">
                      <q-icon size="md" name="insert_chart_outlined" color="white"/>
                    </div>
                    <q-space/>
                    <span class="q-ma-none stats-value-span">{{ averageExpenseCost }}</span>
                  </q-card-section>
                  <q-separator class="q-mx-md q-mt-lg"></q-separator>
                  <q-card-section class="q-mt-sm q-mx-md  q-pa-none">
                    <span style="color: gray">Средняя цена расхода</span>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-md-6 col-lg-3">
                <q-card bordered class="stats-card shadow-1">
                  <q-card-section class="q-ma-md q-pa-none row no-wrap">
                    <div class="stats-icon-div row justify-center items-center shadow-8">
                      <q-icon size="md" name="query_stats" color="white"/>
                    </div>
                    <q-space/>
                    <span class="q-ma-none stats-value-span">{{ pronounceOnThisMonth }}</span>
                  </q-card-section>
                  <q-separator class="q-mx-md q-mt-lg"></q-separator>
                  <q-card-section class="q-mt-sm q-mx-md  q-pa-none">
                    <span style="color: gray">Прогноз расходов на месяц</span>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-md-6 col-lg-3">
                <q-card bordered class="stats-card shadow-1">
                  <q-card-section class="q-ma-md q-pa-none row no-wrap">
                    <div class="stats-icon-div row justify-center items-center shadow-8">
                      <q-icon size="md" name="attach_money" color="white"/>
                    </div>
                    <q-space/>
                    <span class="q-ma-none stats-value-span">{{ spendOnThisMonth }}</span>
                  </q-card-section>
                  <q-separator class="q-mx-md q-mt-lg"></q-separator>
                  <q-card-section class="q-mt-sm q-mx-md  q-pa-none">
                    <span style="color: gray">Расходов в этом месяце</span>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-md-6 col-lg-3">
                <q-card bordered class="stats-card shadow-1">
                  <q-card-section class="q-ma-md q-pa-none row no-wrap">
                    <div class="stats-icon-div row justify-center items-center shadow-8">
                      <q-icon size="md" name="money_off" color="white"/>
                    </div>
                    <q-space/>
                    <span class="q-ma-none stats-value-span">{{
                        teamLimit !== null ? teamLimit.limit : 'Не задано'
                      }}</span>
                  </q-card-section>
                  <q-separator class="q-mx-md q-mt-lg"></q-separator>
                  <q-card-section class="row q-mt-sm q-mx-md  q-pa-none">
                    <span style="color: gray">Лимит расходов в этом месяце</span>
                    <q-space/>
                    <q-btn v-if="isCanUpdate" color="grey" class="team-header-buttons" style="margin-top: -7px"
                           icon="edit" flat @click="openTeamLimitDialog"></q-btn>
                  </q-card-section>
                </q-card>
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>
        <q-card-section class="row q-pt-md q-col-gutter-x-xl q-col-gutter-y-md">
          <div class="col-6 col-md-3">
            <q-select v-model="yearFilterSelect" options-dense :options="yearSelectColumns" dense
                      label="Фильтр по году"/>
          </div>
          <div class="col-6 col-md-3">
            <q-select v-model="monthFilterSelect" options-dense :options="monthSelectOptions" map-options emit-value
                      dense label="Фильтр по месяцу"/>
          </div>
          <div class="col-6 col-md-3 offset-6 offset-md-3 row">
            <q-space/>
            <q-btn no-caps color="primary" v-if="isCanCreate" label="Добавить" @click="expenseDialog = true"></q-btn>
          </div>
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
            no-data-label="Не удалось найти расходы с заданными фильтрами"
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
    <q-dialog v-model="teamLimitDialog">
      <q-card class="q-pa-sm" style="width: 410px">
        <q-card-section class="q-px-md q-py-none q-mx-sm q-mt-lg q-ma-none items-center">
          <h6 class="q-pa-none q-my-sm">Изменение лимита расходов:</h6>
        </q-card-section>
        <q-card-section class="q-mx-sm q-py-none">
          <q-input v-model="teamLimitInput" type="number" label="Значение"/>
        </q-card-section>
        <q-card-actions class="justify-center q-mt-md">
          <q-btn size="md" :disable="teamLimitInput <= 0"
                 style="width: 110px" no-caps
                 color="primary" label="Изменить" @click="editTeamLimit(teamLimitInput)" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="teamSelectDialog" persistent>
      <q-card flat class="q-pa-none" style="max-width: 350px; width: 350px">
        <q-toolbar class="bg-primary text-white shadow-2">
          <q-toolbar-title>Выберите организацию</q-toolbar-title>
        </q-toolbar>

        <q-list bordered >
          <template v-for="team of currentUser.teams" :key="team.teamId" >
            <q-item class="q-ma-none" clickable @click="selectCurrentTeam(team)" v-close-popup v-ripple>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  {{ team.name.substr(0,1) }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{team.name}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator/>
          </template>
        </q-list>
      </q-card>
    </q-dialog>

    <q-dialog v-model="notificationsDialog">
      <q-card flat class="q-pa-none notifications-dialog-card" >
        <q-toolbar class="bg-purple text-white shadow-2">
          <q-toolbar-title>Уведомления</q-toolbar-title>
        </q-toolbar>

        <q-list bordered >

          <template v-for="joinRequest of unReadTeamJoinsRequests" :key="joinRequest" >
            <q-item class="q-ma-none">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  <q-icon name="person_add"/>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>Пользователь {{joinRequest.user.username}} хочет вступить в вашу организацию. Желаете добавить?</q-item-label>
              </q-item-section>

              <q-item-section avatar class="row">
                <div class="row">
                  <q-btn rounded size="sm" color="green" icon="done" class="q-mr-sm" @click="applyJoinRequest(joinRequest)"></q-btn>
                  <q-btn rounded size="sm" color="red" icon="clear" @click="denyJoinRequest(joinRequest)"></q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </template>
          <q-item-label header>Просмотренные: </q-item-label>
          <q-separator/>
          <template v-for="joinRequest of readTeamJoinsRequests" :key="joinRequest" >
            <q-item class="q-ma-none">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  <q-icon name="person_add"/>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>Пользователь {{joinRequest.user.username}} хочет вступить в вашу организацию. Желаете добавить?</q-item-label>
              </q-item-section>

              <q-item-section avatar class="row">
                <div class="row">
                  <q-btn rounded size="sm" color="green" icon="done" class="q-mr-sm" @click="applyJoinRequest(joinRequest)"></q-btn>
                  <q-btn rounded size="sm" color="red" icon="clear" @click="denyJoinRequest(joinRequest)"></q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </template>
        </q-list>
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
import TeamService from "src/services/team/teamService";
import CategoriesDrawer from "components/CategoriesDrawer";
import {daysInMonth} from "src/services/other/tools";

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

const monthSelectOptions = [
  {
    label: 'Январь',
    value: 0
  },
  {
    label: 'Февраль',
    value: 1
  },
  {
    label: 'Март',
    value: 2
  },
  {
    label: 'Апрель',
    value: 3
  },
  {
    label: 'Май',
    value: 4
  },
  {
    label: 'Июнь',
    value: 5
  },
  {
    label: 'Июль',
    value: 6
  },
  {
    label: 'Август',
    value: 7
  },
  {
    label: 'Сентябрь',
    value: 8
  },
  {
    label: 'Октябрь',
    value: 9
  },
  {
    label: 'Ноябрь',
    value: 10
  },
  {
    label: 'Декабрь',
    value: 11
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
    const currentUser = computed(() => store.getters['auth/getCurrentUser']);
    const isCanCreate = computed(() => store.getters['teams/getCreatePermission']);
    const isCanUpdate = computed(() => store.getters['teams/getChangingPermission']);
    const isCanDeleting = computed(() => store.getters['teams/getDeletingPermission']);
    const isCanModerating = computed(() => store.getters['teams/getModeratingPermission'])

    const categoryDrawer = ref(true);
    const teamSelectDialog = ref(false);
    const notificationsDialog = ref(false);
    const yearFilterSelect = ref(0);
    const yearSelectColumns = ref([]);
    const monthFilterSelect = ref(0);
    const currentTeam = computed(() => store.getters['teams/getCurrentTeam']);
    const unReadTeamJoinsRequests = computed(() => store.getters['teams/getUnReadJoinsRequests']);
    const unReadTeamMessages = computed(()=> store.getters['teams/getUnReadTeamMessages']);
    const readTeamJoinsRequests = computed(()=> store.getters['teams/getReadJoinsRequests']);
    const readTeamMessages = computed(()=> store.getters['teams/getReadTeamMessages']);
    const teamLimit = computed(() => store.getters['teams/getTeamLimit']);
    const categories = computed(() => store.getters['teams/getTeamCategories']);
    const selectedCategories = computed(() => store.getters['teams/getSelectedTeamCategories']);

    const toggleCategoryDrawer = () => {
      store.commit('teams/toggleCategoryDrawer');
    }

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
            const date = new Date(expense.date);
            if (date.getFullYear() === yearFilterSelect.value && date.getMonth() === monthFilterSelect.value) {
              let expenseObject = {...expense, categoryName: category.name}
              resultArray.push(expenseObject)
            }
          }
        }
        return resultArray;
      } else {
        return [];
      }
    })

    const getExpensePrice = (expense) => {
      if (expense.fixedPrice !== null) {
        return expense.fixedPrice;
      } else {
        return ((expense.minPrice + expense.maxPrice) / 2)
      }
    }

    const averageExpenseCost = computed(() => {
      let fullSum = 0.0;
      let result = 0.0;
      const expenses = selectedExpenses.value;
      if (expenses.length !== 0) {
        for (let expense of expenses) {
          fullSum += getExpensePrice(expense);
        }
        result = fullSum / expenses.length;
      }
      return result.toFixed(2);
    })

    const spendOnThisMonth = computed(() => {
      let fullSum = 0.0;
      const expenses = selectedExpenses.value;
      if (expenses.length !== 0) {
        for (let expense of expenses) {
          fullSum += getExpensePrice(expense);
        }
      }
      return fullSum.toFixed(2);
    })

    const pronounceOnThisMonth = computed(() => {
      const currentDate = new Date();
      if (currentDate.getFullYear() === yearFilterSelect.value && currentDate.getMonth() === monthFilterSelect.value) {
        let result = 0.0;
        const daysGone = currentDate.getDate();
        const avgOnDay = spendOnThisMonth.value / daysGone;
        const daysLeft = daysInMonth(yearFilterSelect.value, monthFilterSelect.value) - daysGone;
        const pronounce = Number(avgOnDay * daysLeft);
        const alreadySpend = Number(spendOnThisMonth.value);
        result = pronounce + alreadySpend;
        return result.toFixed(2);
      } else {
        return spendOnThisMonth.value;
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

    const teamLimitDialog = ref(false);
    const teamLimitInput = ref(0.0);

    const openTeamLimitDialog = () => {
      teamLimitDialog.value = true;
      if (teamLimit.value) {
        teamLimitInput.value = teamLimit.value.limit;
      }
    }

    const editTeamLimit = (limit) => {
      TeamService.editTeamLimit({
        limit,
        month: monthFilterSelect.value,
        year: yearFilterSelect.value,
        teamId: currentTeam.value.teamId
      })
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

    const visibleColumns = computed(() => {
      let resultColumns = ['name', 'description', 'date', 'price', 'priority', 'category'];
      changeColumnsByPermissions(resultColumns, 'edit', isCanUpdate.value);
      changeColumnsByPermissions(resultColumns, 'delete', isCanDeleting.value);
      return resultColumns;
    })

    const loadPageInfo = async (user, team) => {
      await store.dispatch('teams/setCurrentTeamAction', team);
      await store.dispatch('teams/getUserPermissionInTeam', {
        userId: user.id,
        teamId: team.teamId
      })
      await store.dispatch('teams/getTeamInvites', team.teamId);
      const dateOfCreateApp = new Date(2021, 9, 31);

      const currentDate = new Date();
      let yearsArray = [];
      while (dateOfCreateApp <= currentDate) {
        yearsArray.push(dateOfCreateApp.getFullYear());
        dateOfCreateApp.setFullYear(dateOfCreateApp.getFullYear() + 1);
      }
      yearSelectColumns.value = yearsArray;
      yearFilterSelect.value = currentDate.getFullYear();
      monthFilterSelect.value = currentDate.getMonth();
      store.commit('teams/setTeamLimitByYearAndMonth', {year: yearFilterSelect.value, month: monthFilterSelect.value})
    }

    const numberOfUnreadMessages = computed(()=> {
      if (unReadTeamJoinsRequests.value && unReadTeamMessages.value) {
        return unReadTeamJoinsRequests.value.length + unReadTeamMessages.value.length;
      } else {
        return 0;
      }
    });

    const applyJoinRequest = async (joinRequest) => {
      await store.dispatch('teams/applyJoinRequest', joinRequest);
    }

    const denyJoinRequest = async (joinRequest) => {
      await store.dispatch('teams/denyJoinRequest', joinRequest);
    }

    const selectCurrentTeam = async (team) => {
      await loadPageInfo(currentUser.value, team)
    }

    watch(notificationsDialog, (val)=> {
      if (!val) {
        store.dispatch('teams/readNotifications');
      }
    })

    watch(expenseDialog, (val) => {
      if (!val && expenseEditMode.value) {
        clearExpenseDialogFields();
      }
    })

    watch(yearFilterSelect, (val) => {
      store.commit('teams/setTeamLimitByYearAndMonth', {year: val, month: monthFilterSelect.value})
    })
    watch(monthFilterSelect, (val) => {
      store.commit('teams/setTeamLimitByYearAndMonth', {year: yearFilterSelect.value, month: val})
    })

    watch(selectedExpenses, (val) => {
      console.log(val)
    })

    onMounted(async () => {
      const accessToken = store.getters['auth/getAccessToken'];
      if (currentUser.value && accessToken) {
        if (!isConnected()) {
          connect(accessToken);
        }
      } else {
        await router.push("/auth/login");
      }
      const teams = currentUser.value?.teams;
      if (teams && teams.length !== 0) {
        if (teams.length === 1) {
          await loadPageInfo(currentUser.value, teams[0]);
        } else {
          teamSelectDialog.value = true;
        }
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
      yearFilterSelect,
      monthFilterSelect,
      yearSelectColumns,
      monthSelectOptions,
      averageExpenseCost,
      spendOnThisMonth,
      pronounceOnThisMonth,
      teamLimit,
      teamLimitDialog,
      teamLimitInput,
      teamSelectDialog,
      currentUser,
      notificationsDialog,
      unReadTeamJoinsRequests,
      unReadTeamMessages,
      readTeamJoinsRequests,
      readTeamMessages,
      numberOfUnreadMessages,
      applyJoinRequest,
      denyJoinRequest,
      selectCurrentTeam,
      editTeamLimit,
      openTeamLimitDialog,
      toggleCategoryDrawer,
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

.stats-card {
  min-height: 120px;
}

.stats-icon-div {
  height: 72px;
  width: 72px;
  margin-top: -36px;
  background-color: rgb(255, 164, 22);
}

.stats-value-span {
  font-weight: bold;
  font-size: 32px;
  margin-top: -10px
}

.notifications-dialog-card {
  max-width: 500px;
  width: 500px;
  height: 600px;
  max-height: 600px;
}
</style>
