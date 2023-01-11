function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const url = "http://localhost:6868/api/auth/signup";
  const options = {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  fetch(url, options).then(console.log).catch(console.error);
  resetForm();
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const url = "http://localhost:6868/api/auth/login";
  const options = {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  fetch(url, options).then(getUsers).then(console.log).catch(console.error);
  resetForm();
}

async function getUsers(response) {
  let data = await response.json();
  const user = data.data.user;

  const url = `http://localhost:6868/api/users/${user._id}`;
  const options = {
    credentials: "include",
  };
  return fetch(url, options).then((response) => response.json());
}

async function logOut() {
  const url = "http://localhost:6868/api/auth/logout";
  const options = {
    method: "POST",
    credentials: "include",
  };
  const response = await fetch(url, options);
  return await response.json();
}

function resetForm() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}
