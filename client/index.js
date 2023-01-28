const fs = require("fs");

function login() {
  const publicKey = fs.readFileSync("public.pem", "utf8");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const url = "http://localhost:4848/api/auth/login";
  const options = {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      publicKey: publicKey,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then(getUsers)
    .then(console.log)
    .catch(console.error)
    .finally(() => {
      resetForm();
    });
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const url = "http://localhost:4848/api/auth/signup";
  const options = {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then(console.log)
    .catch(console.error)
    .finally(() => {
      resetForm();
    });
}

async function getUsers(response) {
  let data = await response.json();
  const token = data.data.token;
  const user = data.data.user;

  const url = `http://localhost:4848/api/users/${user._id}`;
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

function resetForm() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}
