<template>
  <div class="q-pa-lg">
    <q-slide-transition>
      <!--                 Login                  -->
      <q-card flat bordered class="my-card q-pt-lg" v-if="step === 1">
        <q-card-section class="q-pt-xl">
          <div class="ft text-h6 row items-center justify-evenly">
            Iniciar sesión
          </div>
        </q-card-section>
        <q-card-section>
          <q-form id="login" @submit="onSubmit" @reset="onReset">
            <q-input
              dense
              outlined
              type="email"
              v-model="email"
              label="Usuario o correo electrónico*"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) || 'Por favor ingrese su usuario.'
              ]"
            />

            <q-input
              dense
              outlined
              type="password"
              v-model="password"
              label="Contraseña *"
              lazy-rules
              :rules="[
                val =>
                  (val !== null && val !== '') ||
                  'Por favor ingrese su contraseña'
              ]"
            />
            <p class="text-grey-6 justify-center" style="text-align:center">
              <a
                class="text-primary"
                style="cursor: pointer;text-decoration: underline;"
                @click="step=3"
              >¿Olvidó su contraseña?</a
              >
            </p>
            <div class="q-pa-sm justify-center" style="text-align:center">
              <q-btn push label="Ingresar" type="submit" color="secondary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!--                 Recuperar contraseña                  -->
      <q-card flat bordered class="my-card q-pt-lg" v-if="step === 3">
        <q-card-section>
          <q-avatar
            style="z-index: 1"
            size="103px"
            class="absolute-center shadow-19"
          >
            <img
              src="https://ikiero.s3.amazonaws.com/Recursos+ikiero/Domis/512x512.png"
            />
          </q-avatar>
        </q-card-section>
        <q-card-section class="q-pt-xl">
          <div class="ft text-h6 row items-center justify-evenly">
            Recuperar contraseña.
          </div>
          <p class="text-center">
            Ingrese su usuario y le serán enviadas las instrucciones para cambiar la contraseña.
          </p>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="onSubmitResetPassword"
            @reset="onReset"
            class="q-gutter-lg"
          >
            <q-input
              dense
              outlined
              type="email"
              v-model="email"
              label="Usuario o correo electrónico*"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) || 'Por favor ingrese su usuario.'
              ]"
            />
            <q-card-section>
              <div class="q-pa-sm">
                <q-btn label="Enviar" type="submit" color="primary"/>
                <q-btn
                  label="Cancelar"
                  @click="onChangeStep(1)"
                  type="reset"
                  color="secondary"
                  flat
                  class="q-ml-sm"
                />
              </div>
            </q-card-section>
          </q-form>
        </q-card-section>
      </q-card>
    </q-slide-transition>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty} from "../../mixins/index";

export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      step: 1,
      code: null
    };
  },
  mixins: [Loading, Noty],
  computed: {
    ...mapState(["token"])
  },
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USER"]),
    onSubmit() {
      if (this.email && this.password) {
        const data = {email: this.email, password: this.password};
        this.showLoading("Validando usuario y contraseña...");
        ServiceApi.post("/user/login", data)
          .then((response) => {
            const {token, user} = response.data;
            this.SET_TOKEN(token.token);
            this.SET_USER(user);
            localStorage.setItem("token", token.token);
            this.hideLoading();
            this.$router.replace("/pending");
            this.Noty(
              "success",
              "Bienvenido, " + user.name + " " + user.lastName
            );
          })
          .catch(error => {
            this.hideLoading();
            this.Noty("error", "Usuario y contraseña inválida.");
          });
      } else {
        this.Noty("error", "Por favor ingrese los datos correctamente.");
      }
    },
    onSubmitResetPassword() {
      if (this.email) {
        const data = {email: this.email};
        this.showLoading("Validando usuario y contraseña...");
        ServiceApi.post("/reset/password", data)
          .then(response => {
            const {status, message} = response.data;
            if (status) {
              this.onChangeStep(1)
              this.Noty("success", message);
            } else {
              this.Noty("error", message);
            }
            this.hideLoading();
          })
          .catch(error => {
            this.hideLoading();
            this.Noty("error", "Usuario invalido.");
          });
      } else {
        this.Noty("error", "Por favor ingrese los datos correctamente.");
      }
    },
    onReset() {
      this.email = null;
      this.password = null;
      this.step = 1;
    },
    onChangeStep(step) {
      this.step = step;
    }
  }
};
</script>
