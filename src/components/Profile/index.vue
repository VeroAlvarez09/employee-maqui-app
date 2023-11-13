<template>
  <div class="q-pa-md" style="max-width: 450px">
    <q-slide-transition>
      <q-card flat bordered class="my-card">
        <q-card-section>
          <q-file
            @input="onInputFile"
            name="imageProfile"
            id="imageProfile"
            v-show="false"
            v-model="this.logo"
            accept=".jpg, .png, .jpeg, image/*"
            @rejected="onRejected"
          />
          <q-avatar
            class="float-right"
            size="100px"
            font-size="52px"
            @click="changeImgProfile('imageProfile')"
          >
            <img v-if="this.image" :src="this.image"/>
            <q-badge floating>
              <q-icon name="camera_enhance" size="25px"/>
            </q-badge>
            <q-avatar
              v-if="!this.image"
              size="30px"
              color="white"
              text-color="primary"
            ></q-avatar>
          </q-avatar>
          <div class="text-subtitle1 justify-evenly ft text-grey-7">¡Hola!</div>
          <div class="text-h6 ft text-grey-9">
            {{ this.$store.state.user.nombre }}<br/>
            {{ this.$store.state.user.apellidos }}
          </div>
        </q-card-section>
        <q-card-section class="text-center q-pa-none">
          <p class="text-grey-6">Actualiza tus datos personales.</p>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <q-form id="login" @submit="onSubmit" class="q-gutter-sm">
            <q-input
              dense
              outlined
              type="text"
              v-model="name"
              label="Nombre completo*"
              :lazy-rules="true"
              :rules="[
                val => (val && val.length > 0) || 'Por favor ingrese su Nombre.'
              ]"
            />

            <q-input
              dense
              outlined
              type="text"
              v-model="lastName"
              label="Apellido completo*"
              :lazy-rules="true"
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
              :lazy-rules="true"
              :rules="[
                val =>
                  (val && val.length > 0) || 'Por favor ingrese su celular.',
                val =>
                  (val && val.length <= 10) ||
                  'Número celular debe ser de 10 dígitos.'
              ]"
            />
            <div style="text-align:center">
              <q-btn push label="actualizar" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-slide-transition>
  </div>
</template>

<script>
import {log} from "util";
import {mapState, mapMutations} from "vuex";
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty, AmazonS3} from "../../mixins/index";

export default {
  name: "Profile",
  data() {
    return {
      name: this.$store.state.user.nombre,
      lastName: this.$store.state.user.apellidos,
      cellPhone: this.$store.state.user.celular,
      email: this.$store.state.user.celular,
      image: this.$store.state.user.imagen,
      logo: null
    };
  },
  mixins: [Loading, Noty, AmazonS3],
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapMutations(["SET_USER"]),
    changeImgProfile(name) {
      const element = document.getElementsByName(name);
      element[0].click();
    },
    onSubmit() {
      const data = {
        nombre: this.name,
        apellidos: this.lastName,
        celular: this.cellPhone,
        imagen: this.image
      };
      this.showLoading("Validando registro...");
      ServiceApi.post("/profile/update", data)
        .then(response => {
          const {status, message, user} = response.data;
          if (status) {
            this.SET_USER(user);
            this.$router.go(-1);
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
    },
    onInputFile(file) {
      this.showLoading("Cargando imágen...");
      this.uploadFile(file, "profileDomi" + this.$store.state.user.id, `Domis/perfil`)
        .then(url => {
          this.image = url;
          this.hideLoading();
        })
        .catch(e => {
          this.hideLoading();
          this.Noty(
            "error",
            "Ocurrió un error al cargar la imagen." + e.message
          );
        });
    },
    onRejected(rejectedEntries) {
      this.Noty(
        "error",
        `El archivo no es válido, debe ser una imagen de perfile.`
      );
    }
  }
};
</script>
