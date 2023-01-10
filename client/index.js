window.addEventListener("load", () => {
  console.log("Begin!");
  getToken();
});

function getToken() {
  const url = "http://localhost:6868/api/auth/login";
  const options = {
    method: "POST",
    body: JSON.stringify({
      email: "betbevn@gmail.com",
      password: "1234",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options).then(getUsers).then(console.log).catch(console.error);
}

async function getUsers(response) {
  const data = await response.json();
  const token = data.data.token;

  const url = "http://localhost:6868/api/users/63a46548efb9dbc77425401b";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  return fetch(url, options).then((response) => response.json());
}

// function logOut() {
//   window.localStorage.removeItem("token");
// }

// function logOut() {
//   const url = "http://localhost:6868/api/auth/logout";
//   const options = {
//     method: "POST",
//     credentials: "include",
//   };
//   return fetch(url, options).then((response) => response.json());
// }
