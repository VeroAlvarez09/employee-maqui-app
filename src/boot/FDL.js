export default ({ router, Vue }) => {
  Vue.prototype.$onDynamicLinkStart = () => {
    cordova.plugins.firebase.dynamiclinks.getDynamicLink().then(function(data) {
      //   console.log("DebLink >>>>", data);
      if (data) {
        //Open on dinamick link
        const path = data.deepLink
          ? data.deepLink.replace("https://domis.ikiero.com", "")
          : null;
        if (path) {
          router.push(path);
        }
      }
    });
  };
  Vue.prototype.$listenDynamicLink = () => {
    cordova.plugins.firebase.dynamiclinks.onDynamicLink(function(data) {
      //Open on dinamick link
      const path = data.deepLink
        ? data.deepLink.replace("https://domis.ikiero.com", "")
        : null;
      if (path) {
        router.push(path);
      }
    });
  };
};
