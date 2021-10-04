<template>
  <q-page class="flex flex-center">
    <div class="col-12">
      <div class="col-4">
        <q-card>

        </q-card>
      </div>
      <div class="col-4">
        <q-card style="width: 400px; background-color: white" flat bordered>
          <q-card-section class="q-py-none q-px-md" style="text-align: center">
            <h3 class="q-my-lg">Millenium</h3>
          </q-card-section>
          <q-card-section class="q-py-none">
            <q-form
              @submit="handleLogin({ username, password })"
              class="q-gutter-sm"
            >
              <q-card flat class="q-pt-none">
                <q-card-section class="q-ma-none q-px-none q-pt-none" style="padding-bottom: 2px;">
                  <q-input
                    standout
                    v-model="username"
                    label="Имя пользователя" :dense="true"
                    :rules="[
                       (val) =>
                       (!!val && val.length >= 6 && val.length <= 16) ||
                       'Имя пользователя должно быть в пределах от 6 до 16 символов',
                    ]"
                    style="padding: 5px 0;"/>
                </q-card-section>
                <q-card-section class="q-ma-none q-px-none q-pt-none">
                  <q-input
                    v-model="email"
                    label="Email"
                    lazy-rules
                    standout
                    :dense="true"
                    :rules="[
                (val) => !!val || 'Поле не может быть пустым',
                isValidEmail,
              ]"
                  />
                </q-card-section>
                <q-card-section class="q-pa-none q-ma-none">
                  <q-input
                    type="password"
                    v-model="password"
                    label="Пароль"
                    lazy-rules
                    standout
                    :dense="true"
                    :rules="[
                (val) =>
                  (!!val && val.length >= 6 && val.length <= 20) ||
                  'Пароль должен содержать от 6 до 20 символов',
              ]"

                  />
                </q-card-section>
                <q-card-section  class="q-px-none q-pt-none q-ma-none q-pb-md">
                  <q-btn no-caps label="Войти" type="submit" color="primary" style="width: 100%"/>
                </q-card-section>
              </q-card>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4 q-pt-lg">
        <q-card flat bordered >
          <q-card-section class="q-py-sm q-px-md row justify-center" style="text-align: center; vertical-align: middle; display: table-cell;" >
            <span>Есть аккаунт?</span>
            <q-btn flat color="primary" :to="'/auth/login'" no-caps label="Войти"></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>


  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {ref} from "vue";
import {isValidEmail} from "src/services/other/tools";

export default {
  name: "SignupPage",
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const username = ref('');
    const password = ref('');
    const email = ref('');

    const handleLogin = async (user) => {
      try {
        const data = await store.dispatch("auth/loginAction", user);
        console.log(data)
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Успешная авторизация",
        });
        await router.push("/");
      } catch (e) {
        message.value = e.response.data.message;
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message,
        });
      }
    }

    return {
      username,
      email,
      password,
      handleLogin,
      isValidEmail
    }
  }
}
</script>

<style scoped>

</style>
