function login() {
  const publicKey = `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3kcYa65r7jK0qp7oxUjW
  4ESbqCWNfjHWtplROwG3Nt8a0SdPfp9buHOY1RLIY4PYPD/3CL89DwKSgj7y0fA0
  rZY/FA/AkZBFyq/Dt8f2LBoqRg/Ai5HSpvvaY6AgVYCfgMOdLvMOubAAXs9z/07W
  B2M5+rOG0F55LmMJ1Upl1DitgnOhQmj/DPW7UjYI8N9wBrbR6DMW4Qhmv6PdEvmG
  Ph20c8XQbrXiOexJCEoGTtPIvT0eP9KHVkpr7G2vQb3mzp+C0F4K47iVzO5igo3y
  rca7AAemnRz8yflFbISoKD0wXLB5jH3LIvprREQgIVsL6o12KMyLU9BkigxfzrSQ
  7QIDAQAB
  -----END PUBLIC KEY-----
  `;

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
