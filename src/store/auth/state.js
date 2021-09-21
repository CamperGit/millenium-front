let user = JSON.parse(localStorage.getItem('user'));
let loggedIn;
if (user) {
  loggedIn = true;
} else {
  loggedIn = false;
  user = null;
}

export default function () {
  return {
    user,
    loggedIn
  }
}
