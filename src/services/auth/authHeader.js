import TokenService from "./tokenService";

export default function authHeader() {
  const token = TokenService.getLocalAccessToken();
  if (token) {
    return { Authorization: 'Bearer ' + token};
  } else {
    return {};
  }
}

