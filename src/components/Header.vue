<template>
  <q-toolbar style="border-radius: 0" class="bg-blue text-white shadow-2 q-pa-none">
    <q-tabs v-model="pageTab" shrink>
      <q-route-tab no-caps name="index" label="Расходы" to="/"/>
      <q-route-tab no-caps name="teamCreate" label="Создание организации"  to="/team/create"/>
    </q-tabs>
    <q-space />
    <template v-if="isLogged">
      <q-btn no-caps flat :label="currentUser.username"/>
      <q-btn no-caps flat label="Выйти" @click="logout" :to="'/auth/login'" class="q-mr-lg"/>
    </template>
    <template v-else>
      <q-btn no-caps flat label="Войти" :to="'/auth/login'" class="q-mr-lg"/>
    </template>
  </q-toolbar>
<!--  <q-slide-transition :duration="400">
    <div v-show="visible">

    </div>

  </q-slide-transition>
  <div class="row">
    <q-space/>
    <q-btn @click="visible=!visible" flat icon="expand_less"/>

  </div>-->
</template>

<script>
import {computed, ref} from "vue"
import {useStore} from "vuex";
export default {
  name: "Header",
  setup() {
    const store = useStore();
    const visible = ref(true);

    const isLogged = computed(()=> store.getters['auth/isLogged']);
    const currentUser = computed(()=> store.getters['auth/getCurrentUser']);
    const pageTab = ref('index');

    const logout = () => {
      store.dispatch('auth/logoutAction');
    }
    return {
      pageTab,
      isLogged,
      currentUser,
      visible,
      logout
    }
  }
}
</script>

<style scoped>

</style>
