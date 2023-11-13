<template>
  <q-page>
    <div class="q-pa-xs-xs">
      <div class="row">
        <div class="col-12 q-pl-sm q-mt-xs" v-if="data && data.length > 0">
          <strong class="ft text-grey-7">Horas registradas</strong>
        </div>
        <div
          class="items-center column text-center q-pt-md"
          v-if="data && data.length === 0"
        >
          <div class="full-width q-pa-md text-center text-grey-7">
            <div class="text-h6 text-bold ft">¡Ups!</div>
            <div class="text-subtitle2" style="max-width: 400px; margin: auto">
              En el momento no tienes horas registras, registra horas trabjadas para poder tener mas información.
            </div>
          </div>
        </div>
        <!-- PEDIDOS -->
        <div
          class="col-12 col-md-6 q-pa-xs q-pt-sm"
          v-for="(order, key) in data"
          :key="key"
        >
          <q-card
            class="my-card"
            style="border-radius: 12px;box-shadow:0 1px 5px rgba(0,0,0,.2);"
          >
            <q-card-section
              class="q-pt-xs q-pb-none"
            >
              <div class="row no-wrap items-center">
                <div class="col ellipsis">
                  <strong class="ft">Empresa:</strong>
                  <div class="text-subtitle2">
                    <strong class="ft">Maquina:</strong>
                  </div>
                </div>

                <div class="col-auto text-grey absolute-right q-pt-xs " style="right: 16px">
                  <q-icon name="home" color="secondary"/>
                  <strong class="ft">{{ order.company.businessName.toUpperCase() }}</strong>
                </div>

                <div class="text-grey q-pt-md row no-wrap items-center">
                  <q-icon name="commute" color="secondary"/>
                  <strong class="ft">{{ order.machine.brand }}</strong>
                </div>
              </div>

              <div class="row justify-between items-center">
                <strong class="ft">Fecha trabajada:</strong>
                <div class="text-grey">
                  <q-icon name="event" color="secondary"/>
                  <strong class="ft">{{ order.workedAt }}</strong>
                </div>
              </div>

              <div class="row justify-between items-center">
                <strong class="ft">Horas trabajadas:</strong>
                <div class="text-grey">
                  <q-icon name="timer" color="secondary"/>
                  <strong class="ft">{{ order.totalHours }} Horas</strong>
                </div>
              </div>

              <div class="row justify-between items-center">
                <strong class="ft">Valor bonificación:</strong>
                <div class="text-grey">
                  <q-icon name="local_atm" color="secondary"/>
                  <strong class="ft">${{ order.valuePerHour | currency }}</strong>
                </div>
              </div>
            </q-card-section>
            <q-separator/>
            <div class="row q-pa-sm items-center justify-between">
              <div class="q-pl-sm">
                <strong class="ft">Ganancia:</strong>
              </div>
              <div class="text-green q-pl-md">
                <strong class="ft">
                  ${{ order.totalValue | currency }}
                </strong>
              </div>
            </div>
          </q-card>
        </div>
        <!-- FIN PEDIDOS -->
      </div>
    </div>
  </q-page>
</template>

<script>
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty, Filters} from "../../mixins/index";
import qs from "qs";
import {mapMutations, mapState, mapActions} from "vuex";
import Moment from "moment";

export default {
  name: "pedido-curso",
  data() {
    return {
      loading: true,
      data: []
    };
  },
  created() {
    this.onRequest();
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
      this.showLoading("consultando horas trabajadas...");
      ServiceApi.get("/hours")
        .then(response => {
          this.data = response.data;
          this.hideLoading();
        })
        .catch(error => {
          this.hideLoading();
          this.Noty("error", error.message);
        });
    }
  }
};
</script>
