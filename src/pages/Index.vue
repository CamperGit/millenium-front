<template>
  <q-page>
    <q-card flat square class="row" style="height: 100%">
      <q-card id="category-card" square class="col-2">
        <q-card-section class=" q-pa-none q-my-sm row">
          <h6 class="q-px-none q-pl-md q-my-sm">Категории:</h6>
          <q-space/>
          <q-btn flat size="md" icon="add" @click="addNewCategoryDialog=true"></q-btn>
        </q-card-section>
        <!--          <q-separator/>
            <q-card-section >
                 <q-input label="Поиск категорий"></q-input>
               </q-card-section>-->
        <q-card-section class="q-pa-none">
          <q-list class="text-primary q-pa-none">
            <q-separator/>
            <q-item clickable v-ripple
                    :active="(selectedCategories && categories && selectedCategories.length === categories.length)"
                    @click="selectAllCategories" class="q-py-sm categories-list-inactive" active-class="categories-list-active">
              <q-item-section>Все</q-item-section>
              <q-space/>
              <q-item-section avatar>
                <span class="category-count-icon">{{ numberOfExpenses }}</span>
              </q-item-section>
            </q-item>
            <q-separator />
            <template v-for="category of categories" :key="category">
              <q-item clickable v-ripple :active="isCategorySelected(category.categoryId)"
                      @click="addSelectedCategory(category)" class="categories-list-inactive" active-class="categories-list-active">
                <q-item-section>{{ category.name === 'EMPTY' ? 'Без категории' : category.name}}</q-item-section>
                <q-space/>
                <q-item-section avatar>
                  <span class="category-count-icon">{{ category.expenses.length }}</span>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card flat square class="col-auto" style="height: 100%">
        {{ currentTeam.name }}
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
          <q-btn size="md" :disable="categoryName < 2 || categoryName.length > 15" style="width: 110px" no-caps
                 color="primary" label="Добавить" @click="createNewCategory(categoryName)" v-close-popup/>
          <q-btn size="md" style="width: 110px" no-caps label="Отмена" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import {defineComponent, ref, computed, onMounted} from 'vue';
import TeamService from "src/services/team/teamService";
import {useRouter} from "vue-router";
import {useStore} from "vuex"

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const router = useRouter();
    const store = useStore();
    const currentTeam = ref({});
    const addNewCategoryDialog = ref(false);
    const categoryName = ref('');
    const categories = ref([]);
    const selectedCategories = ref([]);

    const createNewCategory = async (name) => {
      await store.dispatch('teams/createNewCategory', {name, teamId: currentTeam.value.teamId})
    }

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

    const numberOfExpenses = computed(()=> {
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


    onMounted(() => {
      const currentUser = store.getters['auth/getCurrentUser'];
      if (currentUser === null) {
        router.push("/auth/login");
      }
      const teams = currentUser?.teams;
      if (!teams || teams.length === 0) {
        router.push("/team/create");
      }
      if (teams.length === 1) {
        store.commit('teams/setCurrentTeam', teams[0]);
        currentTeam.value = store.getters['teams/getCurrentTeam'];
        categories.value = store.getters['teams/getTeamCategories'];
      }
    })

    return {
      addNewCategoryDialog,
      currentTeam,
      categoryName,
      categories,
      selectedCategories,
      numberOfExpenses,
      isCategorySelected,
      addSelectedCategory,
      createNewCategory,
      selectAllCategories
    }
  }
})
</script>
<style scoped>
#category-card {
  background-color: #F0F2F4;
  box-shadow: rgba(0, 0, 0, 0.15) 2.4px 0 3.2px;
  margin-right: 5px;
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
</style>
