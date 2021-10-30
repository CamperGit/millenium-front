<template>
  <q-page class="flex flex-center">
    <div class="col-12">
      <div class="col-6">
        <q-card style="width: 400px; background-color: white" flat bordered>
          <q-card-section class="q-py-none q-px-md" style="text-align: center">
            <h3 class="q-my-lg">Millenium</h3>
          </q-card-section>
          <q-card-section class="q-py-none">
            <q-form
              @submit="handleLogin({ username, password })"
              class="q-gutter-sm"
              @validation-error="onValidError"
              @validation-success="errorMessage = null"
            >
              <q-card flat class="q-pt-none">
                <q-card-section class="q-ma-none q-px-none q-pt-none" style="padding-bottom: 2px;">
                  <q-input filled v-model="username" label="Имя пользователя" dense
                           :rules="[
                       (val) =>
                       (!!val && val.length >= 6 && val.length <= 16)
                    ]"
                           style="padding: 5px 0;"/>
                </q-card-section>
                <q-card-section class="q-pa-none q-ma-none">
                  <q-input type="password" v-model="password" label="Пароль" lazy-rules filled dense
                    :rules="[
                (val) =>
                  (!!val && val.length >= 6 && val.length <= 20)
              ]"

                  />
                </q-card-section>
                <q-card-section  class="q-px-none q-pt-none q-ma-none q-pb-md">
                  <q-btn no-caps label="Войти" type="submit" color="primary" style="width: 100%"/>
                </q-card-section>
                <q-card-section v-if="errorMessage" style="text-align: center" class="q-pa-none q-pb-md">
                  <span style="color: #ed4956;">{{errorMessage}}</span>
                </q-card-section>
              </q-card>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 q-pt-lg">
        <q-card flat bordered >
          <q-card-section class="q-py-sm q-px-md row justify-center" style="text-align: center; vertical-align: middle; display: table-cell;" >
            <span>У вас ещё нет аккаунта?</span>
            <q-btn flat color="primary" :to="'/auth/signup'" no-caps label="Зарегистрироваться"></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>


  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {useQuasar} from "quasar";


export default {
  name: "AuthPage",
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const username = ref('');
    const password = ref('');
    const errorMessage = ref(null);

    const handleLogin = async (user) => {
      try {
        const isLoginSuccess = await store.dispatch("auth/loginAction", user);
        if (isLoginSuccess) {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Успешная авторизация",
          });
          const currentUser = store.getters['auth/getCurrentUser'];
          const teams = currentUser.teams;
          if (!teams || teams.length === 0) {
            await router.push("/team/create");
          } else {
            await router.push("/");
          }
        } else {
          errorMessage.value = 'Ошибка авторизации'
        }
      } catch (e) {
        let message = e.response.data.message;
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message,
        });
      }
    }

    const onValidError = (obj) => {
      const label = obj.label;
      switch (label) {
        case 'Имя пользователя': {
          errorMessage.value = 'Имя пользователя должно быть в пределах от 6 до 16 символов';
          break;
        }
        case 'Пароль': {
          errorMessage.value = 'Пароль должен содержать от 6 до 20 символов';
          break;
        }
      }
    }

    return {
      username,
      password,
      errorMessage,
      handleLogin,
      onValidError
    }
  }
}
</script>

<style scoped>

</style>
