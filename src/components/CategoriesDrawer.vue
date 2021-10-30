<template>
  <q-drawer
    v-model="categoryDrawerRef"
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
      <!--          <q-separator/>
          <q-card-section >
               <q-input label="Поиск категорий"></q-input>
             </q-card-section>-->
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
            <q-item clickable v-ripple :active="isCategorySelected(category.categoryId)"
                    @click="addSelectedCategory(category)" class="categories-list-inactive"
                    active-class="categories-list-active" @mouseenter="focusedCategory = category" @mouseleave="focusedCategory = null" >
              <q-item-section>{{ category.name }}</q-item-section>
              <transition name="category-edit">
                <q-item-section v-if="focusedCategory === category" avatar >
                  <q-btn  class="category-edit-button" flat icon="edit" @click="openCategoryEditDialog(category)"></q-btn>
                </q-item-section>
              </transition>
              <q-item-section avatar class="q-ma-none q-pa-none">
                <span class="category-count-icon ">{{ category.expenses.length }}</span>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-drawer>

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
</template>

<script>
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, onMounted, ref, toRefs, watch} from "vue";
import CategoryService from "src/services/expenses/categoryService";

export default {
  name: "CategoriesDrawer",
  props: {
    categoryDrawer : {
      type: Boolean,
      default: false
    },
    categories : {
      type: Array,
      default : ()=> []
    }
  },
  emits: [
    'changedSelectedCategories',
  ],
  setup(props, {emit}) {
    const router = useRouter();
    const store = useStore();
    const {categoryDrawer, categories} = toRefs(props);

    const isCanCreate = computed(()=> store.getters['teams/getCreatePermission']);
    const isCanUpdate = computed(()=> store.getters['teams/getChangingPermission']);
    const isCanDeleting = computed(()=> store.getters['teams/getDeletingPermission']);
    const isCanModerating = computed(()=> store.getters['teams/getModeratingPermission']);

    const currentTeam = ref({});
    const selectedCategories = ref([]);
    const focusedCategory = ref({});
    const addNewCategoryDialog = ref(false);
    const categoryName = ref('');

    watch(selectedCategories, (newVal) => {
      emit('changedSelectedCategories', newVal)
    })

    const createNewCategory = async (name) => {
      await CategoryService.createNewCategory(name, currentTeam.value.teamId);
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

    }

    onMounted(()=> {
      selectedCategories.value.push.apply(selectedCategories.value, categories.value);
    })

    return {
      addNewCategoryDialog,
      currentTeam,
      focusedCategory,
      categoryName,
      numberOfExpenses,
      isCanCreate,
      isCanUpdate,
      isCanDeleting,
      categoryDrawerRef : categoryDrawer,
      selectedCategories,
      isCategorySelected,
      addSelectedCategory,
      createNewCategory,
      selectAllCategories,
      openCategoryEditDialog,
    }
  }
}
</script>

<style scoped>
#category-drawer {
  background-color: #F0F2F4;
  box-shadow: rgba(0, 0, 0, 0.15) 2.4px 0 3.2px;
  min-width: 182px
}

.category-edit-button {
  height: 32px;
  width: 32px;
  margin-right: -15px;
  transition-duration: 20s;
  transition: opacity .5s
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

.category-edit-enter-active,
.category-edit-leave-active {
  transition: opacity .5s
}

.category-edit-enter,
.category-edit-leave-to {
  opacity: 0
}

.categories-list-active {
  color: white;
  background: rgba(25, 118, 210, 0.8);
}
</style>
