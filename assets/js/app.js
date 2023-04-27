let credenciales = {
  username: null,
  password: null,
};
let settings = {};
const getDataForm = (e) => {
  let id = e.target.id;
  let value = e.target.value;

  if (value.length > 0) {
    credenciales[id] = value;
  } else {
    credenciales[id] = null;
  }
};

const loginCorrecto = (user) => {
  let log = {
    status: true,
    user,
    date: new Date(),
  };
  settings.data.log = log;
  localStorage.setItem("SettingsApp", JSON.stringify(settings));
  alert("Login correcto. Bienvenido!");
  location.href = "../../index.html";
};

const login = (e) => {
  e.preventDefault();
  if (Object.values(credenciales).length > 0) {
    if (!Object.values(credenciales).includes(null)) {
      // Verificar credenciales
      console.log(settings);
      let users = settings.data.users;
      let findUser = users.find(
        (user) => user.credentials.username === credenciales.username
      );
      if (findUser !== undefined) {
        console.log(findUser.credentials.password);
        if (findUser.credentials.password === credenciales.password) {
          loginCorrecto(findUser.credentials.username);
        } else {
          alert("Credenciales incorrectas");
        }
      } else {
        alert("Credenciales incorrectas");
      }
    } else {
      alert(
        "La información que proporcionaste es incorrecta o esta incompleta. Verifica que los campos de username y password no esten vacíos."
      );
    }
  } else {
    alert(
      "La información que proporcionaste es incorrecta o esta incompleta. Verifica que los campos de username y password no esten vacíos."
    );
  }
};
const loadListeners = () => {
  document.querySelector("#form").addEventListener("change", getDataForm);
  document.querySelector("#btnLogin").addEventListener("click", login);
};

const loadData = async () => {
  if (localStorage.getItem("SettingsApp") !== null) {
    settings = JSON.parse(localStorage.getItem("SettingsApp"));
    if (settings.data.log.status) {
      location.href = "../../index.html";
    }
  } else {
    let template = await fetch("../../template.json").then((resp) =>
      resp.json()
    );
    localStorage.setItem("SettingsApp", JSON.stringify(template));
  }
};

const loadResources = () => {
  loadData();
  loadListeners();
};

addEventListener("DOMContentLoaded", loadResources());
