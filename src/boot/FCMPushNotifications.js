export default ({ router, Vue }) => {
  Vue.prototype.$getNotifications = () => {
    return new Promise((resolve, reject) => {
      window.FirebasePlugin.onMessageReceived(
        function(message) {
          // console.log("Message type: " + message.messageType);
          if (message.messageType === "notification") {
            // console.log("Notification message received");
            if (message.tap) {
              // console.log("Tapped in " + message.tap);
            }
          }
          console.dir(message);
          resolve(message);
        },
        function(error) {
          reject(error);
        }
      );
    });
  };
  Vue.prototype.$getTokenNotifications = () => {
    return new Promise((resolve, reject) => {
      window.FirebasePlugin.getToken(
        function(fcmToken) {
          resolve(fcmToken);
        },
        function(error) {
          reject(error);
        }
      );
    });
  };
  Vue.prototype.$localPushNotificationNuevoPedido = orderId => {
    cordova.plugins.notification.local.schedule({
      id: orderId,
      title: `Nuevo pedido N°${orderId}`,
      text: "Tenemos un nuevo pedido disponible para tí.",
      smallIcon:
        "https://ikiero.s3.amazonaws.com/Recursos+ikiero/recuros/ikiero.jpg",
      icon:
        "https://ikiero.s3.amazonaws.com/Recursos+ikiero/recuros/ikiero.jpg",
      foreground: true
    });
  };
  Vue.prototype.$localPushNotificationNuevoServicio = servicioId => {
    cordova.plugins.notification.local.schedule({
      id: orderId,
      title: `Nuevo servicio N°${servicioId}`,
      text: "Tenemos un nuevo servicio de entrega disponible para tí.",
      smallIcon:
        "https://ikiero.s3.amazonaws.com/Recursos+ikiero/recuros/ikiero.jpg",
      icon:
        "https://ikiero.s3.amazonaws.com/Recursos+ikiero/recuros/ikiero.jpg",
      foreground: true
    });
  };
};
