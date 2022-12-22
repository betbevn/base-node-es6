window.addEventListener("load", () => {
  console.log("start client>>>");
  getToken();
});

function getToken() {
  const url = "http://localhost:8080/api/auth/login";
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

function getUsers(token) {
  console.log(token, "token");

  const url = "http://localhost:8080/api/users/639dfcc8f8ba8bbedd1ad1f3";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + "",
    },
  };
  return fetch(url, options).then((response) => response.json());
}

// function logOut() {
//   const url = "http://localhost:8080/api/auth/logout";
//   const options = {
//     method: "POST",
//     credentials: "include",
//   };
//   return fetch(url, options).then((response) => response.json());
// }
