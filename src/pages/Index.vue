<template>
  <q-page class="flex flex-center">
<!--    <q-input standout v-model="producer" label="Производитель" />-->
<!--    <q-input standout v-model="bitRate" label="Разрядность" />-->
<!--    <q-input standout v-model="mediaType" label="Тип носителя" />-->
<!--    <q-input standout v-model="expirationDate" label="Срок действия" />-->
<!--    <q-input standout v-model="language" label="Язык" />-->
<!--    <q-input standout v-model="guaranteePeriod" label="Срок гарантии" />-->
<!--    <q-input standout v-model="numberOfDevices" label="Кол-во устройств" />-->
<!--    <q-input standout v-model="price" label="Цена" />-->
<!--    <q-btn @click="createNewProduct(producer,bitRate, mediaType, expirationDate, language, guaranteePeriod, numberOfDevices, price)">Добавить продукт</q-btn>-->
<!--    <q-btn @click="loadProducts">Загрузить продукты</q-btn>-->
    <q-separator/>
    <q-input standout v-model="teamName" label="Название организации" />
    <q-input standout v-model="customNumber" label="Число" />
    <q-btn @click="createNewTeam(teamName, customNumber);">Создать новую организацию</q-btn>
    <q-btn @click="getTeamById(teamName, customNumber)">test</q-btn>
    <q-btn @click="testNumberReq(teamName, customNumber)">test number send</q-btn>

  </q-page>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue';
import ProductService from "src/services/ProductService";
import TeamService from "src/services/team/teamService";
import {useRouter} from "vue-router";
import {useStore} from "vuex"

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const router = useRouter();
    const store = useStore();
    const producer = ref('');
    const bitRate = ref('');
    const mediaType = ref('');
    const expirationDate = ref('');
    const language = ref('');
    const guaranteePeriod = ref('');
    const numberOfDevices = ref('');
    const price = ref('');
    const teamName = ref('');
    const customNumber = ref(0);

    const createNewTeam = (teamName, customNumber) => {
      const {data} = TeamService.createNewTeam(teamName, customNumber);
      console.log(data)
    }

    const getTeamById = async (teamName, customNumber) => {
      const {data} = await TeamService.getTeamById(teamName, customNumber);
      console.log(TeamService.getTeamById(teamName, customNumber))
      console.log(data)
    }

    const testNumberReq = async (name, number) => {
      await TeamService.testRequestBodyWithNumber(name, number);
    }

    const createNewProduct = (producer,bitRate, mediaType, expirationDate, language, guaranteePeriod, numberOfDevices, price) => {
      const {data} = ProductService.createProduct(producer,bitRate, mediaType, expirationDate, language, guaranteePeriod, numberOfDevices, price);
      console.log(data)
    }



    const loadProducts = ()=>{
      console.log( ProductService.getProducts());
    }

    const goUrl = (url) => {
      window.open(url);
    }

    onMounted(()=>{
      const currentUser = store.getters['auth/getCurrentUser'];
      console.log(currentUser);
      if (currentUser === null) {
        router.push("/auth/login");
      }
    })

    return {
      producer,
      bitRate,
      mediaType,
      expirationDate,
      language,
      guaranteePeriod,
      numberOfDevices,
      price,
      teamName,
      customNumber,
      createNewTeam,
      createNewProduct,
      testNumberReq,
      getTeamById,
      loadProducts,
      goUrl
    }
  }
})
</script>
