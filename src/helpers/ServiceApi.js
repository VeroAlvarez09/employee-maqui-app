import axios from "axios";
import Store from "../store/index";

async function post(url, data) {
  let token = (await localStorage.getItem("token")) || Store.state.token;
  return new Promise((resolve, reject) => {
    axios
      .post(`${Store.state.baseURL}${url}`, data, {
        timeout: 20000,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(checkStatus)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        let e = checkStatus(err.response)
        reject(e);
      });
  });
}

async function get(url) {
  let token = (await localStorage.getItem("token")) || Store.state.token;
  let request = axios.get(`${Store.state.baseURL}${url}`, {
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return new Promise((resolve, reject) => {
    request.then(checkStatus)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        let e = checkStatus(err.response)
        reject(e);
      });
  });
}

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let copy = Object.assign({}, response)
    copy.message = response.statusText
    if (copy.status === 401) {
      localStorage.setItem("token", "");
    }
    if (copy.status === 403) {
      copy.message = "El usuario no tiene acceso a esta acción"
    }
    if (copy.status === 500) {
      copy.message = "Ocurrió un error interno en el servidor, por favor intenté mas tarde o comuníquese con el administrador."
    }
    return copy
  }
};

export default {
  post,
  get
};
