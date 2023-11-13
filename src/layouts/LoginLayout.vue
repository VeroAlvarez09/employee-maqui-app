<template>
  <q-layout>
    <q-header class="q-pa-sm bg-primary">
      <q-toolbar>
        <q-toolbar-title class="row absolute-left">
          <img
            src="../assets/maquiApp.png"
            style="height: 60px; width: auto; display: block"
          />
        </q-toolbar-title>

        <q-toolbar-title class="row absolute-right">
          <q-btn label="Registrese" type="submit" outline @click="$router.push('/register')"
                 v-if="$router.currentRoute.fullPath === '/login'"/>
          <q-btn label="Iniciar Sesión" type="submit" outline @click="$router.push('/login')"
                 v-if="$router.currentRoute.fullPath === '/register'"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "LoginLayout",
  data() {
    return {
      leftDrawerOpen: false
    };
  }
};
</script>
