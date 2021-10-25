<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; background-color: white" flat bordered>
      <q-card-section class="q-py-none q-px-md" style="text-align: center">
        <h4 class="q-my-lg">Выберите режим использования</h4>
      </q-card-section>
      <q-card-section class="q-py-none">
        <q-input filled dense v-model="teamName" label="Название организации" />
      </q-card-section>
      <q-card-section>
        <q-btn @click="createNewTeam(teamName);">Сохранить</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {onMounted, ref} from "vue";
import TeamService from "src/services/team/teamService";
import ProductService from "src/services/ProductService";

export default {
  name: "CreateTeamPage",
  setup() {
    const router = useRouter();
    const store = useStore();
    const teamName = ref('');

    const createNewTeam = (teamName) => {
      const {data} = TeamService.createNewTeam(teamName);
      console.log(data)
    }

    const getTeamById = async (teamName, customNumber) => {
      const {data} = await TeamService.getTeamById(teamName, customNumber);
      console.log(TeamService.getTeamById(teamName, customNumber))
      console.log(data)
    }

    return {
      teamName,
      createNewTeam,
      getTeamById,
    }
  }
}
</script>

<style scoped>

</style>
