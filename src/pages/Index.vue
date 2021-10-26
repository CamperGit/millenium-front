<template>
  <q-page>
    <q-card flat square class="row" style="height: 100%">
      <q-card flat square class="col-2" style="height: 100%">
        <q-card-section class="items-center" style="text-align: center">
          <h6 class="q-pa-none q-my-sm">Категории:</h6>
        </q-card-section>
      </q-card>
      <q-card flat square class="col-auto" style="height: 100%">
        {{currentTeam.name}}
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue';
import TeamService from "src/services/team/teamService";
import {useRouter} from "vue-router";
import {useStore} from "vuex"

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const router = useRouter();
    const store = useStore();
    const currentTeam = ref({});

    const getTeamById = async (teamName, customNumber) => {
      const {data} = await TeamService.getTeamById(teamName, customNumber);
      console.log(TeamService.getTeamById(teamName, customNumber))
      console.log(data)
    }


    onMounted(()=>{
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
      }
    })

    return {
      currentTeam,
      getTeamById,
    }
  }
})
</script>
