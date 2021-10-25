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
        <q-tab-panel name="create" class="q-pa-none q-ma-none" >
          <q-card style="width: 100%; height: 290px; background-color: white" flat class="q-pa-none q-ma-none">
            <q-card-section class="q-pt-md">
              <h6 class="q-pa-none q-ma-none">Введите название организации:</h6>
              <q-input class="q-pt-sm" filled dense v-model="teamName" label="Название организации"/>
            </q-card-section>
            <q-card-section class="q-py-none q-pt-sm q-px-md">
              <h6 class="q-pa-none q-ma-none">Выберите режим использования:</h6>
            </q-card-section>
            <q-card-section class="row justify-between">
              <q-radio v-model="teamType" val="self" label="Для личного использования" />
              <q-radio left-label v-model="teamType" val="team" label="Организация" />
            </q-card-section>
            <q-card-section>
              <q-btn @click="createNewTeam(teamName);" no-caps color="primary" style="width: 100%">Сохранить</q-btn>
            </q-card-section>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="join" class="q-pa-none">
          <q-card style="width: 100%; height: 290px; background-color: white" flat class="q-pa-none q-ma-none">
            <q-card-section class="q-pt-md" >
              <h6 class="q-pa-none q-ma-none">Введите ссылку приглашение, чтобы присоединиться к организации:</h6>
              <q-input class="q-pt-sm" filled dense v-model="teamName" label="Пригласительная ссылка"/>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <span>Вы будете добавлены в организацию только после просмотра одобрения администратором</span>
            </q-card-section>
            <q-card-section style="padding-top: 40px">
              <q-btn no-caps color="primary" style="width: 100%">Отправить заявку</q-btn>
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
import ProductService from "src/services/ProductService";

export default {
  name: "CreateTeamPage",
  setup() {
    const router = useRouter();
    const store = useStore();
    const teamName = ref('');
    const teamPageTabs = ref('join');
    const teamType = ref('team');

    const createNewTeam = (teamName) => {
      const {data} = TeamService.createNewTeam(teamName);
      console.log(data)
    }

    const getTeamById = async (teamName, customNumber) => {
      const {data} = await TeamService.getTeamById(teamName, customNumber);
      console.log(TeamService.getTeamById(teamName, customNumber))
      console.log(data)
    }

    watch(teamPageTabs, (val)=> {
    })

    return {
      teamName,
      teamType,
      teamPageTabs,
      createNewTeam,
      getTeamById,
    }
  }
}
</script>

<style scoped>
q-tab__label {
  font-size: 25px;
}

.tabs-font-size{
  font-size: 20px;
}
</style>
