import Vue from "vue";
import Vuex from "vuex";
import Moment from "moment";
import Orders from "./Orders";
import Servicios from "./Servicios";
import ServiceApi from "../helpers/ServiceApi";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
export default new Vuex.Store({
  modules: {
    Orders,
    Servicios
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV,
  state: {
    token: localStorage.getItem("token") || null,
    baseURL: "/api/employee",
    user: {},
    updateApp: false,
    coordenadas: null,
    disconectedSocketDate: null
  },
  actions: {
    changeStatusOrder({ state }, data) {
      return new Promise((resolve, reject) => {
        ServiceApi.post("/orders/change/status", {
          pedido_id: data.pedido_id,
          estado: data.estado
        })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    changeCoordinates() {
      return new Promise((resolve, reject) => {
        ServiceApi.post("/update/coordinates", {
          coordenadas
        })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  mutations: {
    SET_USER(state, value) {
      state.user = value;
    },
    SET_TOKEN(state, value) {
      state.token = value;
    },
    SET_UPDATE_APP(state, value) {
      state.updateApp = value;
    },
    SET_COORDENADAS(state, value) {
      state.coordenadas = value;
      return new Promise((resolve, reject) => {
        ServiceApi.post("/update/coordinates", {
          coordenadas: value
        })
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    SET_DISCONECTED_SOCKET_DATE(state) {
      state.disconectedSocketDate = Moment().unix();
    }
  }
});
