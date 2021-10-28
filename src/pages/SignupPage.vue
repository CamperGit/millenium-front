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
              @submit="handleRegister({ username, email, password })"
              @validation-error="onValidError"
              @validation-success="errorMessage = null"
            >
              <q-card flat class="q-pt-none">
                <q-card-section class="q-pa-none">
                  <q-input id="username-field" filled v-model="username" label="Имя пользователя" dense class="q-pa-none"
                           :rules="[
                       (val) =>
                       (!!val && val.length >= 6 && val.length <= 16),
                    ]"
                           style="padding: 3px 0;"/>
                </q-card-section>
                <q-card-section  class="q-pa-none">
                  <q-input id="email-field" filled v-model="email" label="Email" lazy-rules dense class="q-pa-none"
                           :rules="[
                (val) => !!val ,
                isValidEmail,
              ]"
                           style="padding: 3px 0;"
                  />
                </q-card-section>
                <q-card-section class="q-pa-none">
                  <q-input id="password-field" filled type="password" v-model="password" label="Пароль" lazy-rules dense class="q-pa-none"
                           :rules="[
                (val) =>
                  (!!val && val.length >= 6 && val.length <= 20),
              ]"
                           style="padding: 3px 0;"
                  />
                </q-card-section>
                <q-card-section class="q-pt-md q-px-none">
                  <q-btn no-caps label="Зарегистрироваться" type="submit" color="primary" style="width: 100%"/>
                </q-card-section>
                <q-card-section v-if="errorMessage" style="text-align: center" class="q-pa-none q-pb-md">
                  <span style="color: #ed4956;">{{errorMessage}}</span>
                </q-card-section>
              </q-card>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4 q-pt-lg">
        <q-card flat bordered>
          <q-card-section class="q-py-sm q-px-md row justify-center"
                          style="text-align: center; vertical-align: middle; display: table-cell;">
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
    const errorMessage = ref(null);

    const handleRegister = async (user) => {
      try {
        const isRegisterSuccess = await store.dispatch("auth/registerAction", user);
        if (isRegisterSuccess) {
          const isLoginSuccess = await store.dispatch("auth/loginAction", {
            username: user.username,
            password: user.password
          });
          if (isLoginSuccess) {
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Успешная регистрация",
            });

            const currentUser = store.getters['auth/getCurrentUser'];
            const teams = currentUser.teams;
            if (!teams || teams.length === 0) {
              await router.push("/team/create");
            } else {
              await router.push("/");
            }
          } else {
            await router.push("/auth/login");
          }
        }
      } catch (e) {
        errorMessage.value = e?.response?.data?.message;
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          errorMessage,
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
        case 'Email': {
          errorMessage.value = 'Поле не может быть пустым';
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
      email,
      password,
      errorMessage,
      handleRegister,
      isValidEmail,
      onValidError
    }
  }
}
</script>

<style scoped>

</style>
