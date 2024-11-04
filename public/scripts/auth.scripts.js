/*auth.scripts.js*/
console.log("auth.scripts.js");

const password = document.getElementById("password");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/*showPassword function is used for hiding and showing password type & icons*/
const showPassword = () => {
  if (password.type === "password") {
    password.type = "text";
    showpass.src = "/icons/hidePassword.svg";
  } else {
    password.type = "password";
    showpass.src = "/icons/password.svg";
  }
};

/*logout function is used for loggging out from website */
const logout = () => {

  const cookies = document.cookie.split(";");
  for (let index = 0; index < cookies.length; index++) {
    document.cookie =
      cookies[index] + "=; expires =+" + new Date(0).toUTCString();
  }
  /*after logout we are redirecting it to login page of wolf share*/
  window.location.pathname = "/login";
};
