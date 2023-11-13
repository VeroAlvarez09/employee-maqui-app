import {Notify} from "quasar";

let allways = true;
export default async ({Vue}) => {

  Vue.prototype.$getGeolocation = () => {
    return new Promise((resolve, reject) => {
      cordova.plugins.diagnostic.requestLocationAuthorization(
        function (status) {
          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              console.log("Permission not requested");
              break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              console.log("Permission denied");
              break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              console.log("Permission granted always");
              window.navigator.geolocation.getCurrentPosition(resolve, reject);
              break;
            case cordova.plugins.diagnostic.permissionStatus
              .GRANTED_WHEN_IN_USE:
              allways = false;
              console.log("Permission granted only when in use");
              window.navigator.geolocation.getCurrentPosition(resolve, reject);
              break;
          }
        },
        function (error) {
          console.log(error);
        },
        allways
          ? cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS
          : cordova.plugins.diagnostic.locationAuthorizationMode.WHEN_IN_USE
      );
    });
  };
  Vue.prototype.$openSettingsGps = () => {
    cordova.plugins.diagnostic.isGpsLocationEnabled(
      function (enabled) {
        if (!enabled && openSetting) {
          cordova.plugins.diagnostic.switchToLocationSettings();
        }
      },
      function (error) {
        console.error("The following error occurred: " + error);
      }
    );
  };
  Vue.prototype.$watchGps = () => {
    return new Promise((resolve, reject) => {
      cordova.plugins.diagnostic.getLocationAuthorizationStatus(
        function (status) {
          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              window.navigator.geolocation.watchPosition(resolve, reject, {
                maximumAge: 3000,
                timeout: 30000,
                enableHighAccuracy: true
              });
              break;
            case cordova.plugins.diagnostic.permissionStatus
              .GRANTED_WHEN_IN_USE:
              window.navigator.geolocation.watchPosition(resolve, reject, {
                maximumAge: 3000,
                timeout: 30000,
                enableHighAccuracy: true
              });
              break;
          }
        },
        function (error) {
          reject(error);
        }
      );
    });
  };
};
