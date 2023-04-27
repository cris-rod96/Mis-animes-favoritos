let form,
  btnRegistrar,
  box_verificaciones = null;

const servers = [
  "hotmail.com",
  "outlook.com",
  "hotmail.es",
  "outlook.es",
  "yahoo.com",
  "gmail.com",
];

let data = {
  name: null,
  lastName: null,
  email: null,
  age: null,
  sex: null,
  credentials: {
    username: null,
    password: null,
  },
};

let auxErrores = {
  age: ["menor-edad", "edad-excedida", "edad-correcta"],
  email: [
    "email-no-disponible",
    "server-incorrecto",
    "arroba-null",
    "formato-incorrecto",
    "email-correcta",
  ],
  username: ["usuario-invalido", "username-correcta"],
  password: ["password-invalida", "password-correcta"],
};

let settings = {};

const showVerificacion = (data_box) => {
  let element = document.querySelector(`div[data-box=${data_box}]`);
  element.classList.remove("display-none");
  element.classList.add("display-flex");
};

const hideVerification = (data_box) => {
  let element = document.querySelector(`div[data-box=${data_box}]`);
  element.classList.remove("display-flex");
  element.classList.add("display-none");
};

const showValidInformation = (message, data_box) => {
  let element = document.querySelector(`div[data-box="${data_box}"]`);
  if (element === null) {
    box_verificaciones.innerHTML += `<div class="verificacion" data-box="${data_box}">
        <div class="icono color-valid">
          <ion-icon name="checkmark-circle"></ion-icon>
        </div>
        <p>${message}</p>
      </div>`;
  } else {
    element.classList.remove("display-none");
    element.classList.add("display-flex");
  }
};

const showErrorsWhenEmptyFields = (id) => {
  let data_boxes = auxErrores[id];

  data_boxes.forEach((data_box) => {
    let element = document.querySelector(`div[data-box="${data_box}"]`);
    if (data_box.split("-")[1] != "correcta") {
      element.classList.remove("display-none");
      element.classList.add("display-flex");
    } else {
      element.classList.add("display-none");
      element.classList.remove("display-flex");
    }
  });
};

const verifyEdad = (edad) => {
  let element = document.querySelector("div[data-box='edad-correcta']");
  if (edad < 18) {
    showVerificacion("menor-edad");
    hideVerification("edad-excedida");
    if (element != null) element.classList.add("display-none");
    return false;
  } else if (edad > 50) {
    hideVerification("menor-edad");
    showVerificacion("edad-excedida");
    console.log(element);
    if (element != null) element.classList.add("display-none");
    return false;
  } else {
    hideVerification("menor-edad");
    hideVerification("edad-excedida");
    showValidInformation("La edad ingresada es correcta.", "edad-correcta");
    return true;
  }
};
const verifyEmail = (email) => {
  let emailValido = false;
  let splitEmail = email.split("@");
  let element = document.querySelector("div[data-box='email-correcta']");
  if (splitEmail.length === 2) {
    if (splitEmail[1].length > 0 && splitEmail[0].length > 0) {
      if (servers.includes(splitEmail[1])) {
        let users = settings.data.users;
        let findUserByEmail = users.find((user) => user.email === email);
        if (findUserByEmail === undefined) {
          // showVerificacion(true, "Email ingresado correctamente", "email");
          hideVerification("email-no-disponible");
          hideVerification("server-incorrecto");
          hideVerification("arroba-null");
          hideVerification("formato-incorrecto");
          showValidInformation(
            "El email ingresado es correcto",
            "email-correcta"
          );
          emailValido = true;
        } else {
          showVerificacion("email-no-disponible");
          hideVerification("server-incorrecto");
          hideVerification("arroba-null");
          hideVerification("formato-incorrecto");
          if (element !== null) element.classList.add("display-none");
        }
      } else {
        hideVerification("email-no-disponible");
        showVerificacion("server-incorrecto");
        hideVerification("arroba-null");
        hideVerification("formato-incorrecto");
        if (element !== null) element.classList.add("display-none");
      }
    } else {
      hideVerification("email-no-disponible");
      hideVerification("server-incorrecto");
      hideVerification("arroba-null");
      showVerificacion("formato-incorrecto");
      if (element !== null) element.classList.add("display-none");
    }
  } else {
    hideVerification("email-no-disponible");
    hideVerification("server-incorrecto");
    showVerificacion("arroba-null");
    hideVerification("formato-incorrecto");
  }

  return emailValido;
};

const verifyUser = (user) => {
  let element = document.querySelector("div[data-box='username-correcta']");
  let findUser = settings.data.users.find(
    (us) => us.credentials.username === user
  );

  if (findUser !== undefined) {
    showVerificacion("usuario-invalido");
    if (element !== null) element.classList.add("display-none");
    return false;
  } else {
    hideVerification("usuario-invalido");
    showValidInformation(
      "El usuario ingresado esta disponible.",
      "username-correcta"
    );
    return true;
  }
};

const verifiyEmptyFields = () => {
  let dataValid = false;
  for (let key in data) {
    if (key === "credentials") {
      let { username, password } = data[key];
      dataValid = username !== null && password !== null;
    } else {
      dataValid = data[key] !== null;
    }
  }
  return dataValid;
};

const verifyPassword = (password) => {
  let element = document.querySelector("div[data-box='password-correcta']");
  let passValida = false;
  if (password.length >= 6) {
    hideVerification("password-invalida");
    showValidInformation(
      "La contraseña ingresada es aceptable",
      "password-correcta"
    );
    passValida = true;
  } else {
    showVerificacion("password-invalida");
    if (element !== null) element.classList.add("display-none");
  }

  return passValida;
};

const getDataForm = (e) => {
  let { id, value } = e.target;
  if (value.length > 0 && value !== "") {
    if (id !== "username" && id !== "password") {
      if (id === "age") {
        value = Number(value);
        if (verifyEdad(value)) {
          data[id] = value;
        } else {
          data[id] = null;
        }
      } else if (id === "email") {
        if (verifyEmail(value)) {
          data[id] = value;
        } else {
          data[id] = null;
        }
      } else {
        data[id] = value;
      }
    } else if (id === "username") {
      if (verifyUser(value)) {
        data.credentials[id] = value;
      } else {
        data.credentials[id] = null;
      }
    } else if (id === "password") {
      if (verifyPassword(value)) {
        data.credentials[id] = value;
      } else {
        data.credentials[id] = null;
      }
    }
  } else {
    showErrorsWhenEmptyFields(id);
    if (id === "username" || id === "password") {
      data.credentials[id] = null;
    } else {
      data[id] = null;
    }
  }

  if (verifiyEmptyFields()) {
    hideVerification("campos-vacios");
    showValidInformation(
      "Todos los campos han sido completados",
      "campos-correcta"
    );
  } else {
    showVerificacion("campos-vacios");
    let element = document.querySelector("div[data-box='campos-correcta']");
    if (element !== null) element.classList.add("display-none");
  }
};

const resetData = () => {
  form.reset();
  for (let key in data) {
    if (key === "credentials") {
      data.credentials[key] = null;
    } else {
      data[key] = null;
    }
  }

  // Hide Verification
  hideVerification("email-correcta");
  hideVerification("edad-correcta");
  hideVerification("username-correcta");
  hideVerification("password-correcta");
  hideVerification("campos-correcta");

  // Show verification
  showVerificacion("email-no-disponible");
  showVerificacion("server-incorrecto");
  showVerificacion("arroba-null");
  showVerificacion("formato-incorrecto");
  showVerificacion("menor-edad");
  showVerificacion("edad-excedida");
  showVerificacion("usuario-invalido");
  showVerificacion("password-invalida");
  showVerificacion("campos-vacios");

  alert("Su registro se ha completado correctamente.");
  location.href = "../../index.html";
};

const registerUser = (e) => {
  e.preventDefault();
  if (verifiyEmptyFields()) {
    settings.data.users.push(data);
    console.log(settings);
    localStorage.setItem("SettingsApp", JSON.stringify(settings));
    resetData();
  } else {
    alert(
      "No se pudo completar el registro. Revise la caja de verificaciones."
    );
  }
};

const loadListeners = () => {
  form.addEventListener("change", getDataForm);
  btnRegistrar.addEventListener("click", registerUser);
};
const loadElements = () => {
  form = document.querySelector("#form-register");
  btnRegistrar = document.querySelector("#btnRegistrar");
  box_verificaciones = document.querySelector(".verificaciones");

  loadListeners();
};

const loadData = async () => {
  let dataInLocalStorage = localStorage.getItem("SettingsApp");
  if (dataInLocalStorage !== null) {
    settings = JSON.parse(dataInLocalStorage);
  } else {
    let template = await fetch("../../template.json").then((data) =>
      data.json()
    );
    localStorage.setItem("SettingsApp", JSON.stringify(template));
    loadData();
  }
};

const loadResources = () => {
  loadData();
  loadElements();
};

addEventListener("DOMContentLoaded", loadResources);
