import ServiceApi from "../../helpers/ServiceApi";
export function getServicios({ commit }) {
  return new Promise((resolve, reject) => {
    ServiceApi.get("/orders/list/servicios")
      .then(response => {
        commit("setServicios", response.data.servicios);
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function getServiciosActivos({ commit }) {
  return new Promise((resolve, reject) => {
    ServiceApi.get("/orders/list/servicios/activos")
      .then(response => {
        commit("setServiciosActivos", response.data.servicios);
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function aceptarServicio({ commit, state }, servicio_id) {
  return new Promise((resolve, reject) => {
    ServiceApi.post("/orders/aceptar/servicio", { servicio_id })
      .then(response => {
        if (response.data.status) {
          const newServicios = state.servicios.filter(
            s => s.id === response.data.servicio_id
          );
          commit("setServicios", newServicios);
        }
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function cambiarEstadoServicio({ commit, dispatch }, data) {
  return new Promise((resolve, reject) => {
    ServiceApi.post("/orders/servicio/cambiar/estado", {
      servicio_id: data.servicio_id,
      estado_id: data.estado_id
    })
      .then(response => {
        dispatch("getServiciosActivos");
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
}
