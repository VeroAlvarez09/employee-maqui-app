<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";


export default {
  name: "App",
  computed: {
    ...mapState(["token"])
  },
  beforeCreate() {
    if (this.$q.platform.is.cordova) {
      this.$onDynamicLinkStart();
      this.$listenDynamicLink();
    }
  },
  created() {
    const token = this.token || localStorage.getItem("token");
    if (token) {
      this.$router.push("/pending");
    }
  }
};
</script>
