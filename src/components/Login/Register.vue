<template>
  <q-page class="bg-grey-3">
    <div class="q-pa-md" style="max-width: 450px">
      <q-slide-transition>
        <!--                 Login                  -->
        <q-card flat bordered class="my-card q-pt-lg" v-if="!accept">
          <q-card-section class="q-pt-xl">
            <div class="ft text-h6 row items-center justify-evenly">
              Registro Domiciliario
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-form
              id="login"
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-xs"
            >
              <q-input
                dense
                outlined
                type="text"
                v-model="name"
                label="Nombre completo*"
                :rules="[
                  val =>
                    (val && val.length > 0) || 'Por favor ingrese su Nombre.'
                ]"
              />

              <q-input
                dense
                outlined
                type="text"
                v-model="lastName"
                label="Apellido completo*"
                :rules="[
                  val =>
                    (val && val.length > 0) || 'Por favor ingrese su apellido.'
                ]"
              />

              <q-input
                dense
                outlined
                type="number"
                v-model="cellPhone"
                label="Celular*"
                :rules="[
                  val =>
                    (val && val.length > 0) || 'Por favor ingrese su celular.',
                  val =>
                    (val && val.length <= 10) ||
                    'Número celular debe ser de 10 dígitos.'
                ]"
              />

              <q-input
                dense
                outlined
                type="email"
                v-model="email"
                label="Email *"
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
                :rules="[
                  val =>
                    (val !== null && val !== '') ||
                    'Por favor ingrese su contraseña',
                  val =>
                    (val && val.length >= 8) ||
                    'La contraseña debe tener mínimo 8 caracteres.'
                ]"
              />

              <div class="row justify-center">
                <q-uploader
                  label="Foto de perfil"
                  auto-upload
                  :url="onInputFile"
                />
              </div>

              <div class="q-mt-sm q-gutter-sm">
                <q-field
                  ref="toggle"
                  :value="terms"
                  :rules="[
                    val => val || 'Debe aceptar los términos y condiciones.'
                  ]"
                >
                  <template v-slot:control>
                    <q-checkbox
                      v-model="terms"
                      label="Aceptó los terminos y condiciones"
                      color="primary"
                    />
                  </template>
                </q-field>
                <q-field
                  ref="toggle"
                  :value="politics"
                  :rules="[
                    val =>
                      val ||
                      'Debe aceptar las políticas de tratamientos de datos.'
                  ]"
                >
                  <template v-slot:control>
                    <q-checkbox
                      v-model="politics"
                      label="Autorizo de manera voluntaria, expresa e informada a Maqui App S.A.S para el tratamientos de datos personales"
                      color="primary"
                    />
                  </template>
                </q-field>
              </div>

              <q-card-section>
                <div class="q-pa-sm">
                  <q-btn
                    push
                    label="Crear cuenta"
                    type="submit"
                    color="primary"
                  />
                  <q-btn
                    label="Cancelar"
                    type="reset"
                    color="secondary"
                    flat
                    class="q-ml-sm"
                    @click="$router.go(-1)"
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
import { mapState, mapMutations } from "vuex";
import ServiceApi from "../../helpers/ServiceApi";
import { Loading, Noty, AmazonS3 } from "../../mixins/index";

export default {
  name: "Register",
  data() {
    return {
      name: null,
      lastName: null,
      cellPhone: null,
      email: null,
      password: null,
      accept: false,
      image: null,
      avatar: null,
      terms: false,
      politics: false,
      tokenNotification: null
    };
  },
  mixins: [Loading, Noty, AmazonS3],
  props: {
    onChangeStep: Function
  },
  created() {
    if (this.$q.platform.is.cordova) {
      this.$getTokenNotifications().then(token => {
        this.tokenNotification = token;
      });
    }
  },
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USER"]),
    onSubmit() {
      if (!this.terms && !this.politics) {
        this.Noty(
          "error",
          "Debe aceptar los terminos y condiciones para poder continuar con el registro."
        );
        return false;
      }
      if (this.image) {
        const data = {
          email: this.email,
          password: this.password,
          nombre: this.name,
          apellidos: this.lastName,
          celular: this.cellPhone,
          imagen: this.image,
          tokenNotification: this.tokenNotification
        };
        this.showLoading("Validando registro...");
        ServiceApi.post("/register", data)
          .then(response => {
            const { status, message } = response.data;
            if (status) {
              this.$router.push("/login");
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
        this.Noty("error", "La imagen de perfil es obligatoria.");
      }
    },
    openSelectFile(id) {
      const element = document.getElementById(id);
      element.click();
    },
    onInputFile(file) {
      this.showLoading("Cargando imágen...");
      this.uploadFile(file[0], file[0].name, `Domis/perfil`)
        .then(url => {
          this.image = url;
          this.hideLoading();
        })
        .catch(e => {
          this.hideLoading();
          this.Noty("error", "Ocurrió un error al cargar la imagen.");
        });
    },
    onReset() {
      this.name = null;
      this.lastName = null;
      this.cellPhone = null;
      this.email = null;
      this.password = null;
      this.accept = false;
      this.image = false;
    }
  }
};
</script>
