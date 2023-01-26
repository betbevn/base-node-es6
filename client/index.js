function login() {
  const url = "http://localhost:6868/api/auth/login";
  const options = {
    method: "GET",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options).then(getUsers).then(console.log).catch(console.error);
}
