<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="q-pa-sm col justify-center items-center"
      :style="$q.screen.width < 1000 ? 'text-align: center;' : ''"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <div>
          <q-btn flat round dense>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section @click="profile"
                  >Empleado id: {{ this.$store.state.user.id }}
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="profile">Mi perfil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section @click="logout"
                  >Cerrar session
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
      <q-chip push color="secondary" text-color="white" class="ft">
        {{
          `${this.$store.state.user.id} - ${this.$store.state.user.name} ${this.$store.state.user.lastName}`
        }}
      </q-chip>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="600"
    >
      <div
        class="bg-primary text-center q-pt-lg q-pb-xl"
        style="clip-path:circle(210% at 50% -120%)"
      >
        <img
          src="../assets/maquiApp.png"
          alt
        />
      </div>
      <q-card-section class="text-center">
        <div class="caption q-pt-sm ft">IngeRenta SAS &#169;</div>
      </q-card-section>
      <q-list padding>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container
      class="bg-grey-2"
    >
      <q-page class="flex-center bg-grey-2">
        <q-page>
          <div class="q-pa-md">
            <div class="row">
              <router-view/>
            </div>
          </div>
        </q-page>
      </q-page>
    </q-page-container>
    <q-footer
      elevated
      color="transparent"
      v-if="$q.platform.is.cordova || $q.screen.width < 1000"
    >
      <q-tabs
        no-caps
        v-model="tab"
        dense
        class="bg-grey-2 text-dark"
        indicator-color="secondary"
      >
        <q-tab
          name="logout"
          icon="power_settings_new"
          color="green"
          label="Salir"
          @click="logout"
        />

        <q-tab
          name="index"
          icon="dashboard"
          label="Inicio"
          @click="$router.push('/pending')"
        />
        <q-tab
          name="hours"
          icon="event"
          label="Mis horas"
          @click="$router.push('/progress')"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";
import {mapMutations, mapState, mapActions} from "vuex";
import {Loading, Noty, Utils} from "src/mixins";

export default {
  name: "MainLayout",
  components: {
    EssentialLink
  },
  computed: {
    ...mapState(["user", "updateApp", "coordenadas", "disconectedSocketDate"]),
    ...mapState("Orders", ["ordersInProgress", "orders"]),
    ...mapState("Servicios", ["servicios"])
  },
  mixins: [Loading, Noty, Utils],
  methods: {
    ...mapMutations([
      "SET_TOKEN",
      "SET_USER",
      "SET_UPDATE_APP",
      "SET_COORDENADAS"
    ]),
    ...mapMutations("Orders", ["SET_ORDERS_IN_PROGRESS"]),
    ...mapActions(["changeStatusOrder"]),
    profile() {
      this.$router.push("/profile");
    },
    logout() {
      localStorage.setItem("token", "");
      this.SET_USER("");
      this.SET_TOKEN("");
      this.$router.push({path: "/login"});
    },

  },
  data() {
    return {
      login: false,
      leftDrawerOpen: false,
      tab: "pedidos",
      essentialLinks: [
        {
          title: "Registrar horas",
          icon: "timer",
          link: "/pending"
        },
        {
          title: "Mi horas",
          icon: "event",
          link: "/progress"
        }
      ]
    };
  },
};
</script>
