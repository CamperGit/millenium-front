<template>
  <q-page class="flex flex-center">
    <q-card style="width: 600px; background-color: white" flat bordered>
      <q-tabs v-model="teamPageTabs" class="row col-12" content-class="tabs-font-size">
        <q-tab class="col-6" no-caps name="create">
          <span style="font-size: 17px">Создать организацию</span>
        </q-tab>
        <q-tab class="col-6" no-caps name="join">
          <span style="font-size: 17px">Присоединиться</span>
        </q-tab>
      </q-tabs>
      <q-separator/>
      <q-tab-panels v-model="teamPageTabs" class="q-pa-none q-ma-none">
        <q-tab-panel name="create" class="q-pa-none q-ma-none">
          <q-card style="width: 100%; background-color: white" flat class="q-pa-none q-ma-none">
            <q-card-section class="q-pt-md">
              <h6 class="q-pa-none q-ma-none">Введите название организации:</h6>
              <q-input :disable="isTeamNameEnabled" class="q-pt-sm" filled dense v-model="teamName"
                       label="Название организации"/>
            </q-card-section>
            <q-card-section class="q-py-none q-pt-sm q-px-md">
              <h6 class="q-pa-none q-ma-none">Выберите режим использования:</h6>
            </q-card-section>
            <q-card-section class="row justify-between">
              <q-radio v-model="teamType" val="self" label="Для личного использования"/>
              <q-radio v-model="teamType" val="team" label="Организация" left-label/>
            </q-card-section>
            <q-card-section>
              <q-btn @click="createNewTeam(teamName);" no-caps color="primary" style="width: 100%">Сохранить</q-btn>
            </q-card-section>
            <q-card-section v-if="errorMessage" style="text-align: center" class="q-pa-none q-pb-md">
              <span style="color: #ed4956;">{{ errorMessage }}</span>
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="join" class="q-pa-none">
          <q-card style="width: 100%; background-color: white" flat class="q-pa-none q-ma-none">
            <q-card-section class="q-pt-md">
              <h6 class="q-pa-none q-ma-none">Введите ссылку приглашение, чтобы присоединиться к организации:</h6>
              <q-input class="q-pt-sm" filled dense v-model="inviteLink" label="Пригласительная ссылка"/>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <span>Вы будете добавлены в организацию только после просмотра и одобрения вашей заявки администратором</span>
            </q-card-section>
            <q-card-section style="padding-top: 40px">
              <q-btn :disable="inviteLink.length < 32" no-caps color="primary" @click="sendJoinRequest(inviteLink)" style="width: 100%">Отправить заявку</q-btn>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>


  </q-page>
</template>

<script>
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {onMounted, ref, watch} from "vue";
import TeamService from "src/services/team/teamService";
import {useQuasar} from "quasar";

export default {
  name: "CreateTeamPage",
  setup() {
    const router = useRouter();
    const store = useStore();
    const $q = useQuasar();

    const isTeamNameEnabled = ref(false);
    const teamName = ref('');
    const teamPageTabs = ref('create');
    const teamType = ref('team');
    const currentUser = store.getters["auth/getCurrentUser"];
    const errorMessage = ref(null);
    const inviteLink = ref('');

    const createNewTeam = async (name) => {
      try {
        const userId = currentUser.id;
        const data = await store.dispatch('teams/createNewTeam', {name, userId});
        if (data) {
          await store.dispatch('teams/setCurrentTeamAction', data);
          const teamsBefore = currentUser.teams.length;
          await store.dispatch('auth/addTeamAction', data)
          const teamsAfter = currentUser.teams.length;
          if (teamsBefore === teamsAfter) {
            throw new Error('Ошибка добавления команды пользователю');
          } else {
            await router.push('/')
          }
        } else {
          throw new Error('Ошибка при создании организации');
        }
      } catch (e) {
        errorMessage.value = 'Ошибка при создании организации';
        console.log(e)
      }

    }

    const sendJoinRequest = async (link) => {
      const data = await TeamService.sendJoinRequest(link, currentUser.id)
      if (data) {
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Заявка успешно отправлена",
        });
      } else {
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "Ошибка отправки заявки. Проверьте вашу пригласительную ссылку",
        });
      }
    }

    watch(teamName, (val) => {
      if (val === currentUser.username && teamType.value !== 'self') {
        teamType.value = 'self';
      }
    })

    watch(teamPageTabs, (val) => {
      errorMessage.value = null;
    })

    watch(teamType, (val) => {
      if (val === 'self') {
        teamName.value = currentUser.username;
        isTeamNameEnabled.value = true;
      } else {
        teamName.value = '';
        isTeamNameEnabled.value = false;
      }
    })

    onMounted(() => {
      if (currentUser === null) {
        router.push('/auth/login')
      }
    })

    return {
      teamName,
      teamType,
      teamPageTabs,
      isTeamNameEnabled,
      errorMessage,
      inviteLink,
      createNewTeam,
      sendJoinRequest,
    }
  }
}
</script>

<style scoped>
q-tab__label {
  font-size: 25px;
}

.tabs-font-size {
  font-size: 20px;
}
</style>
