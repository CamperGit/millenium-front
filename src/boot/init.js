import { boot } from 'quasar/wrappers'
import {api, axios} from "boot/axios";
import EventBus from "src/common/eventBus";
import TokenService from "../services/auth/tokenService"
import {isTokenExpired} from "../services/auth/tokenService"
import {connect} from "src/services/other/websocket";
/** TODO aboba */
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { router, store} ) => {
  // something to do
  let userFromStorage = await JSON.parse(localStorage.getItem('user'));
  let accessTokenFromStorage = await JSON.parse(localStorage.getItem('accessToken'));
  let refreshTokenFromStorage = await JSON.parse(localStorage.getItem('refreshToken'))
  store.commit('auth/setUser', userFromStorage);
  store.commit('auth/setAccessToken', accessTokenFromStorage);
  store.commit('auth/setRefreshToken', refreshTokenFromStorage);

  EventBus.on("logout", async () => {
    store.dispatch("auth/logoutAction");
    //Probably we don't need it
    await router.push("/auth/login");
  });

  const cancelRequest = async (cause) => {
    await EventBus.dispatch("logout");
    throw new axios.Cancel(cause);
  }

  api.interceptors.request.use(
    async (config) => {
      const url = config.url;
      if (url !== '/auth/refreshtoken' && url !== '/auth/signin' && url !== '/auth/signup') {
        let accessToken = store.getters['auth/getAccessToken'];
        let refreshToken = store.getters['auth/getRefreshToken'];
        try {
          if (accessToken && refreshToken) {
            let accessTokenValue = accessToken.token;
            let accessTokenType = accessToken.type;
            if (isTokenExpired(accessToken)) {
              console.log("Access token was expired")
              if (isTokenExpired(refreshToken)) {
                await cancelRequest("Refresh token was expired")
              } else {
                console.log("Refresh token doesn't expired")
                const refreshTokenValue = refreshToken.token;
                const success = await store.dispatch('auth/refreshTokensAction', refreshTokenValue)
                if (success) {
                  console.log(accessTokenValue)
                  accessToken = store.getters['auth/getAccessToken'];
                  accessTokenValue = accessToken.token;
                  console.log(accessTokenValue)
                  accessTokenType = accessToken.type;
                  config.headers["Authorization"] = accessTokenType + ' ' + accessTokenValue;
                } else {
                  await cancelRequest("Error in refresh token action")
                }
              }
            } else {
              console.log("Access token doesn't expired")
              config.headers["Authorization"] = accessTokenType + ' ' + accessTokenValue;
            }
          } else {
            await cancelRequest("No access or refresh tokens")
          }
        } catch (e) {
          console.log(e);
          await cancelRequest(e);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  try {
    const currentUser = store.getters['auth/getCurrentUser'];
    const accessToken = store.getters['auth/getAccessToken'];
    if (currentUser && accessToken) {
      connect(accessToken);
      const data = await store.dispatch('auth/loadUserInfoAction');
    } else {
      EventBus.dispatch("logout");
    }
  } catch (e) {
    EventBus.dispatch("logout");
    console.log(e);
  }

})
