<template>
  <q-page>
    <div class="q-pa-xs">
      <div class="row">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.$store.state.user.name }}
              {{ this.$store.state.user.lastName }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Registra horas realizadas para un mejor control para la maquina que estas operando.<br><br>
            <strong>¡IMPORTANTE!</strong> Registrar las horas del horometro.
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              @click="openModal = true"
              fab
              icon="assignment"
              class="position-sticky"
              color="dark"
            />
          </q-card-actions>
        </q-card>

        <q-dialog v-model="openModal" persistent transition-show="scale" transition-hide="scale">
          <q-card style="width: 300px">
            <q-card-section class="bg-dark text-white">
              <div class="text-h6">Registrar horas</div>
            </q-card-section>

            <q-card-section>
              <q-form
                ref="myForm"
                id="register"
                @submit="onRequest"
                class="q-gutter-sm row"
              >
                <div class="row">
                  <div class="col-12 q-pt-sm">
                    <q-input
                      v-model="data.workedAt"
                      filled
                      type="date"
                      label="Fecha"
                      color="secondary"
                      :rules="[val => (val && val !== '') || 'Por favor ingrese una fecha.']"
                    />
                  </div>

                  <div class="col-12 q-pt-sm">
                    <q-input
                      v-model="data.initialTime"
                      filled
                      type="time"
                      label="Hora inicio"
                      color="secondary"
                      :rules="[val => (val && val !== '') || 'Por favor ingrese una hora.']"
                    />
                  </div>

                  <div class="col-12 q-pt-sm">
                    <q-input
                      v-model="data.endTime"
                      filled
                      type="time"
                      label="Hora fin"
                      color="secondary"
                      :rules="[val => (val && val !== '') || 'Por favor ingrese una hora.']"
                    />
                  </div>

                  <div class="col-12 q-pt-sm">
                    <q-input
                      v-model="data.totalHours"
                      filled
                      type="number"
                      label="Total horas operadas en la maquina"
                      color="secondary"
                      :rules="[val => (val && val !== '') || 'Por favor ingrese un total de horas operadas por la maquina.']"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>

            <q-separator/>

            <q-card-actions class="q-pa-lg">
              <q-btn label="Guardar" type="submit" color="primary" @click="onRequest"/>
              <q-btn label="Cancelar" color="secondary" flat class="q-ml-sm" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script>
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty, Filters} from "../../mixins/index";
import Moment from "moment";

export default {
  name: "PedidosPendientes",
  data() {
    return {
      openModal: false,
      data: {
        workedAt: Moment().format("YYYY-MM-DD"),
        initialTime: "",
        endTime: "",
        totalHours: 0
      }
    };
  },
  created() {

  },
  mixins: [Loading, Noty, Filters],
  methods: {
    diff(date, now = Moment()) {
      if (date) {
        const before = Moment(date);
        return now.diff(before, "minutes");
      }
      return "";
    },
    onRequest() {
      this.$refs.myForm.validate().then(success => {
        if (success) {
          this.showLoading("Registrando horas...");
          ServiceApi.post("/hours", this.data)
            .then(() => {
              this.$router.push({path: "/progress"});
              this.hideLoading();
            })
            .catch(error => {
              this.hideLoading();
              this.Noty("error", error.data.message);
            });
        } else {
          this.Noty("error", "Por favor registrar toda la información.");
        }
      })


    }
  },
};
</script>
