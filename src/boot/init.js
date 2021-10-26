import { boot } from 'quasar/wrappers'
import {api} from "boot/axios";
import EventBus from "src/common/eventBus";
import TokenService from "../services/auth/tokenService"
/** TODO aboba */
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { router, store} ) => {
  // something to do

  EventBus.on("logout", () => {
    store.dispatch("auth/logoutAction");
    //Probably we don't need it
    router.push("/auth/login");
  });

  api.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url === "/auth/refreshtoken" && err.response) {
        //How refresh token was expired, we need to logout user from system (maybe router push to login page)
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;
          EventBus.dispatch("logout");
          return api(originalConfig);
        }
      }
      if (originalConfig.url !== "/auth/signin" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const {accessToken, refreshToken} = await TokenService.refreshTokens()
            await store.dispatch('auth/refreshTokensAction', accessToken, refreshToken);
            originalConfig.headers["Authorization"] = 'Bearer ' + accessToken;
            return api(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );

  const currentUser = store.getters['auth/getCurrentUser'];
  if (currentUser) {
    const data = await store.dispatch('auth/loadUserInfoAction');
    console.log(data)
  }
})
