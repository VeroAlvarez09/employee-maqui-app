import Vue from "vue";
import WsPlugin from "adonis-vue-websocket";
import moment from "moment";

Vue.use(WsPlugin, { adonisWS: window.adonis.Ws });
export default async ({ Vue, store }) => {
  Vue.prototype.$WsConect = () => {
    return new Promise((resolve, reject) => {
      Vue.ws.disconnect();
      Vue.ws.connect(
        {
          wsDomain: process.env.VUE_WS_DOMAIN,
          jwtToken: store.state.token
        },
        {
          path: "adonis-ws",
          reconnection: true,
          reconnectionDelay: 100,
          reconnectionDelayMax: 500,
          reconnectionAttempts: 300
        }
      );
      Vue.ws.socket.on("open", () => {
        console.log("SOCKET IO CONECTED:::" + moment().format("LTS"));
        store.commit("SET_DISCONECTED_SOCKET_DATE");
        resolve({ status: true, message: "Conexión socket establecida." });
      });
      Vue.ws.socket.on("close", () => {
        console.log("SOCKET IO DISCONECTED::::" + moment().format("LTS"));
        resolve({ status: false, message: "Socket desconectado." });
      });
    });
  };
  //Suscripción al canal de pedidos del socketWsPedidos
  Vue.prototype.$WsTopics = async domiId => {
    //Suscripciones canal por domiciliario.
    let subscription = Vue.ws.socket.getSubscription(`DOMIS:${domiId}`);
    if (!subscription) {
      subscription = Vue.ws.subscribe(`DOMIS:${domiId}`);
    }
    subscription.on("onConnectedDomi", data => {
      console.log(
        `CONECTADO AL CANAL DE DOMIS:${domiId}--` + moment().format("LTS")
      );
    });

    subscription.on("onNuevoPedidoDomis", data => {
      store.commit("SET_UPDATE_APP", true); // actualizar la app por si se encuentra en sección de listado de pedidos
      store.commit("Orders/SET_NEW_ORDER", data); // Notificar que se agrego un nuevo pedido sin procesar por Domiciliario
    });
    subscription.on("onNewService", data => {
      store.dispatch("Servicios/getServicios"); // Notificar que se agrego un nuevo pedido sin procesar por Domiciliario
      store.dispatch("Servicios/getServiciosActivos");
    });
    subscription.on("onUpdateService", data => {
      store.dispatch("Servicios/getServicios"); // Notificar que se agrego un nuevo pedido sin procesar por Domiciliario
      store.dispatch("Servicios/getServiciosActivos");
    });

    //// Suscripciones canal general de domiciliarios.
    let subscriptionGeneral = Vue.ws.socket.getSubscription(`DOMIS:GENERAL`);
    if (!subscriptionGeneral) {
      subscriptionGeneral = Vue.ws.subscribe(`DOMIS:GENERAL`);
      console.log(
        `CONECTADO AL CANAL DE DOMIS:GENERAL--` + moment().format("LTS")
      );
    }
    subscriptionGeneral.on("onDeletePedidoDomis", data => {
      store.commit("SET_UPDATE_APP", true); // actualizar la app por si se encuentra en sección de listado de pedidos
    });
    subscriptionGeneral.on("onUpdateService", data => {
      store.dispatch("Servicios/getServicios"); // Notificar que se agrego un nuevo pedido sin procesar por Domiciliario
      store.dispatch("Servicios/getServiciosActivos");
    });
    subscriptionGeneral.on("onNewService", data => {
      store.dispatch("Servicios/getServicios"); // Notificar que se agrego un nuevo pedido sin procesar por Domiciliario
      store.dispatch("Servicios/getServiciosActivos");
    });
  };
};
