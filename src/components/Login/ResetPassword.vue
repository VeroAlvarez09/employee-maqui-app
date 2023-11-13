<template>
  <q-page class="bg-grey-3">
    <div class="q-pa-md" style="max-width: 450px">
      <q-slide-transition>
        <!--                 Login                  -->
        <q-card flat bordered class="my-card q-pt-lg">
          <q-card-section class="q-pt-xl">
            <div class="ft text-h6 row items-center justify-evenly">
              Restaurar contraseña
            </div>
            <p class="text-center">
              Recupere su contraseña para ingresar nuevamente con su usuario.
            </p>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-form
              id="login"
              @submit="onSubmit"
              class="q-gutter-xs"
            >
              <q-input
                dense
                outlined
                type="password"
                v-model="password"
                label="Nueva contraseña*"
                :rules="[
                val => (val && val.length > 0) || 'Por favor ingrese su nueva contraseña.',
                val =>(val && val.length >= 8) || 'La contraseña debe tener mínimo 8 caracteres.'
              ]"
              />

              <q-input
                dense
                outlined
                type="password"
                v-model="repetPassword"
                label="Confirme su nueva contraseña*"

                :rules="[
                val => (val && val.length > 0) || 'Por favor ingrese su nueva contraseña.',
                val => (val === password) || 'Las contraseñas no coinciden.',
                val =>(val && val.length >= 8) || 'La contraseña debe tener mínimo 8 caracteres.'
              ]"
              />


              <q-card-section>
                <div class="q-pa-xs text-center">
                  <q-btn
                    push
                    label="Cambiar contraseña"
                    type="submit"
                    color="primary"
                  />
                </div>
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>
      </q-slide-transition>
    </div>
  </q-page>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty, AmazonS3} from "../../mixins/index";

export default {
  name: "ResetPassword",
  data() {
    return {
      repetPassword: null,
      password: null,
    };
  },
  mixins: [Loading, Noty],
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USER"]),
    onSubmit() {
      const {token} = this.$router.currentRoute.query
      if (this.password === this.repetPassword) {
        const data = {
          password: this.password,
          token,
        };
        this.showLoading("Actualizando contraseña...");
        ServiceApi.post("/reset/password/update", data)
          .then(response => {
            const {status, message} = response.data;
            if (status) {
              this.$router.push("/login")
              this.Noty("success", message);
            } else {
              this.Noty("error", message);
            }
            this.hideLoading();
          })
          .catch(error => {
            this.hideLoading();
            this.Noty("error", error.message);
          });
      } else {
        this.Noty("error", "Las contraseñas no coinciden.");
      }
    },
  }
};
</script>
