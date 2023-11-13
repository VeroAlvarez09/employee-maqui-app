<template>
  <div class="fullscreen">
    <q-card flat class="column overflow-hidden full-height">
      <q-toolbar class="bg-primary text-white ft row" style="max-height: 50px;">
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          icon="arrow_back"
          class="q-mr-sm col-auto"
        />
        <q-toolbar-title class="col text-center"
        >Pedido N° {{ order.pedido_id }}
        </q-toolbar-title
        >
        <div class="col-1"></div>
      </q-toolbar>
      <q-scroll-area class="col full-height">
        <q-card style="max-width: 500px">
          <q-card-section>
            <q-card
              style="border-radius: 12px;box-shadow:0 1px 5px rgba(0,0,0,.2);"
              class="animated flipInX col-12 col-sm-6 q-mb-sm"
            >
              <q-card-section>
                <div>
                  <b>Recoger en la tienda: </b> <b class="text-grey-10 ft"> {{ order.fecha_recogida | hourFormat }} </b>
                </div>
                <div>
                  <b>Pedido realizado: </b> <b class="text-grey-10 ft">{{ order.fecha | diffDate }} Min
                  <q-btn flat round icon="timer" size="sm"/>
                </b>
                </div>
                <q-stepper vertical color="primary" :value="1" animated>
                  <q-step
                    :name="1"
                    :title="order.nombre_comercio"
                    icon="settings"
                    active-icon="store"
                    active-color="secondary"
                  >
                    {{ order.sede_id ? order.direccion_sede : order.direccion_comercio }}
                    <q-stepper-navigation class="q-gutter-sm">
                      <q-btn
                        color="primary"
                        icon="location_on"
                        @click="
                            navigation(
                              order.sede_id ? order.sede_latitud : order.comercio_latitud,
                              order.sede_id ? order.sede_longitud : order.comercio_longitud
                            )
                          "
                      />
                      <q-btn
                        color="primary"
                        icon="phone"
                        @click="goCall(order.numero_confirmacion)"
                      />
                    </q-stepper-navigation>
                  </q-step>
                  <q-step
                    :name="1"
                    :title="order.nombre + ' ' + order.apellidos"
                    icon="settings"
                    active-icon="home"
                    active-color="secondary"
                  >
                    <p>{{ order.celular }}</p>
                    <p>{{ order.direccion_envio }}</p>
                    <q-stepper-navigation class="q-gutter-sm">
                      <q-btn
                        color="primary"
                        icon="location_on"
                        @click="
                            navigation(
                              order.latitud_cliente,
                              order.longitud_cliente
                            )
                          "
                      />
                      <q-btn
                        color="primary"
                        icon="phone"
                        @click="goCall(order.celular)"
                      />
                    </q-stepper-navigation>
                  </q-step>
                </q-stepper>
              </q-card-section>
            </q-card>
            <q-card
              style="border-radius: 12px;box-shadow:0 1px 5px rgba(0,0,0,.2);"
              class="animated flipInX col-12 col-sm-6"
            >
              <q-card-section>
                <div class="text-h6">
                  <q-btn flat round icon="list"/>
                  <b>Articulos:</b>
                </div>

                <div
                  class="q-gutter-sm"
                  v-for="(productOrder, k) in order.productsOrder"
                  :key="k"
                >
                  <div class="q-pa-md">
                    <div class="row justify-between q-gutter-sm">
                      <div>
                        <q-badge
                          outline
                          color="blue"
                          :label="productOrder.cantidad + 'X'"
                        />
                      </div>
                      <div>
                        <b>{{ productOrder.nombre_producto }}</b>
                      </div>
                      <div>
                        <b class="text-green"
                        >${{ productOrder.valor_unidad | currency }}</b
                        >
                      </div>
                    </div>
                  </div>
                  <q-separator></q-separator>
                </div>
                <div class="q-pa-md">
                  <div class="row justify-center">
                    <div class="col-5 q-pt-xs"></div>
                    <div class="col-5 q-pt-xs q-pl-sm">
                      <b>Subtotal:</b>
                    </div>
                    <div class="col-2 q-pt-xs q-pl-sm">
                      <b class="text-green">${{ order.subtotal | currency }}</b>
                    </div>

                    <div class="col-5 q-pt-xs"></div>
                    <div class="col-5 q-pt-xs q-pl-sm">
                      <b>Domilicio:</b>
                    </div>
                    <div class="col-2 q-pt-xs q-pl-sm">
                      <b class="text-green"
                      >${{ order.valor_domicilio | currency }}</b
                      >
                    </div>

                    <div class="col-5 q-pt-xs"></div>
                    <div class="col-5 q-pt-xs q-pl-sm">
                      <b>Total:</b>
                    </div>
                    <div class="col-2 q-pt-xs q-pl-sm">
                      <b class="text-green">${{ order.total | currency }}</b>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card>
      </q-scroll-area>
      <q-card-actions align="center">
        <q-btn
          style="width: 80%"
          icon="loupe"
          v-if="order.estado_id !== 2 && order.estado_id !== 3"
          color="positive"
          @click="detail(order.pedido_id)"
          push
          label="Detalle"
        >
        </q-btn>
        <q-btn
          v-if="order.estado_id === 2 || order.estado_id === 3"
          color="positive"
          label="Aceptar pedido"
          push
          @click="onChangeStatus(order.pedido_id, 5)"
          icon="check"
        >
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import {Loading, Noty, Filters} from "../../mixins/index";
import ServiceApi from "src/helpers/ServiceApi";
import {mapMutations, mapState, mapActions} from "vuex";

export default {
  name: "ModalOrder",
  mixins: [Loading, Noty, Filters],
  computed: {
    ...mapState("Orders", ["order", "ordersInProgress"])
  },
  methods: {
    ...mapMutations("Orders", ["SET_ORDERS_IN_PROGRESS"]),
    ...mapActions(["changeStatusOrder"]),
    onChangeStatus(pedido_id, estado) {
      this.showLoading("Estamos realizando los cambios...");
      this.changeStatusOrder({pedido_id, estado})
        .then(response => {
          const {status, message} = response.data;
          if (status) {
            this.Noty("success", message);
            this.SET_ORDERS_IN_PROGRESS(this.ordersInProgress + 1);
            this.detail(pedido_id);
          } else {
            this.Noty("error", message);
            this.$router.push("/pending")
          }
          this.hideLoading();
          this.loading = false;
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
          this.loading = false;
        });
    },
    detail(pedido_id) {
      this.$router.push("/order/detail/" + pedido_id);
    },
    goCall(cel) {
      window.location = "tel:+57" + cel;
    },
    navigation(lat, lng) {
      window.open("https://maps.google.com/?q=" + lat + "," + lng);
    }
  },
  data() {
    return {
      loading: false
    };
  }
};
</script>
