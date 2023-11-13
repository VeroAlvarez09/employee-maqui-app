<template>
  <div class="fullscreen">
    <q-card flat class="column overflow-hidden full-height">
      <q-toolbar class="bg-primary text-white ft row" style="max-height: 50px;">
        <q-btn
          @click="$router.push('/progress')"
          flat
          round
          dense
          icon="arrow_back"
          class="col-auto"
        />
        <q-toolbar-title class="col text-center"
        >Pedido N° {{ order.pedido_id }}
        </q-toolbar-title
        >
        <div class="col-1"></div>
      </q-toolbar>
      <q-scroll-area class="col full-height">
        <q-stepper v-model="estado" vertical color="secondary" animated>
          <q-step
            :name="4"
            title="Dirigete lo mas pronto posible al comercio."
            icon="store"
            active-icon="store"
            :done="estado > 5"
            active-color="secondary"
            done-color="deep-orange"
            v-if="estado === 4"
          >
            <span class="text-grey">Dirigete ya a:</span>
            <p class="text-black"><strong>{{ directionStore.direction }}</strong></p>
            <p class="text-grey">
              El comercio ha indicado que puedes pasar por el pedido a las <strong>{{order.fecha_recogida | hourFormat}}</strong>.
            </p>
            <p class="text-grey">
              Estas a {{ directionStore.distance }}Km para llegar a la tienda, dirigete lo más pronto posible.
            </p>
            <q-badge
              outline
              color="primary"
              :label="directionStore.distance"
            />
            <strong> Kílometros</strong>
          </q-step>

          <q-step
            :name="5"
            title="Dirigete lo mas pronto posible al comercio."
            icon="store"
            active-icon="store"
            :done="estado > 5"
            active-color="secondary"
            done-color="deep-orange"
            v-if="estado >= 5"
          >
            <span class="text-grey">Dirigete ya a:</span>
            <p class="text-black"><strong>{{ directionStore.direction }}</strong></p>
            <p class="text-grey">
              El comercio ha indicado que puedes pasar por el pedido a las <strong>{{order.fecha_recogida | hourFormat}}</strong>.
            </p>
            <p class="text-grey">
              Estas a {{ directionStore.distance }} Km para llegar a la tienda, dirigete antes de las <strong>{{order.fecha_recogida | hourFormat}}</strong>.
            </p>
            <q-badge
              outline
              color="primary"
              :label="directionStore.distance"
            />
            <strong> Kílometros</strong>
          </q-step>

          <q-step
            :name="6"
            title="Solicita los productos en la tienda."
            icon="add_shopping_cart"
            active-icon="add_shopping_cart"
            :done="estado > 6"
            active-color="secondary"
            done-color="deep-orange"
          >
            <p>
              Marca los productos que ya tienes antes de finalizar este paso.
            </p>

            <q-separator/>
            <br/>
            <div
              class="q-gutter-sm"
              v-for="(productOrder, k) in productsOrder"
              :key="k"
            >
              <q-checkbox
                keep-color
                v-model="productOrder.reclamado"
                color="secondary"
                @input="onChangeStatusProduct(productOrder.id)"
              >
                <div class="q-pa-md justify-between">
                  <div class="row justify-center">
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
                  </div>
                </div>
              </q-checkbox>
            </div>
          </q-step>

          <q-step
            :name="7"
            title="Dirigete y entrega el pedido."
            icon="where_to_vote"
            active-icon="where_to_vote"
            :done="estado > 7"
            active-color="secondary"
            done-color="deep-orange"
          >
            <p class="text-grey">Dirigete ya a:</p>
            <p class="text-black">
              <strong>{{ data.direccion_envio }}</strong>
            </p>
            <p class="text-grey">
              Dirigete lo mas pronto posible, el cliente esta esperando por su
              pedido.
            </p>
          </q-step>

          <q-step
            :name="8"
            title="Entrega los productos."
            icon="how_to_reg"
            active-icon="how_to_reg"
            active-color="secondary"
            done-color="deep-orange"
          >
            <p class="text-grey">
              Pregunta por:
              <strong class="text-dark"
              >{{ data.nombre }} {{ data.apellido }}</strong
              >
            </p>
            <p class="text-grey">
              Subtotal:
              <strong class="text-dark">{{ data.subtotal | currency }}</strong>
            </p>
            <p class="text-grey">
              Domicilio:
              <strong class="text-dark">{{
                  data.valor_domicilio | currency
                }}</strong>
            </p>
            <p class="text-grey">
              Total a cobrar:
              <strong class="text-dark">{{ data.total | currency }}</strong>
            </p>
            <q-separator/>
            <q-stepper-navigation>
              <q-btn
                flat
                icon="phone_in_talk"
                color="blue"
                no-caps
                label="Llamar al cliente"
                @click="goCall"
              >
                <q-icon name="chevron_right"/>
              </q-btn>
            </q-stepper-navigation>
          </q-step>
          <q-separator/>
          <q-card-actions align="center">
            <q-btn-group>
              <q-btn
                size="sm"
                label="Navegar al punto"
                no-caps
                icon="directions"
                :disable="estado !== 5 && estado !== 7"
                @click="navigation"
              />
              <q-btn
                no-caps
                size="sm"
                label="Chat con cliente"
                icon="chat"
                @click="goToWhatssap(data.celular)"
              />
              <q-btn
                size="sm"
                no-caps
                label="Soporte iKiero"
                icon="headset_mic"
                @click="goToWhatssap(3015438139)"
              />
            </q-btn-group>
          </q-card-actions>
        </q-stepper>
      </q-scroll-area>
      <q-card-actions vertical>
        <q-btn
          rounded
          color="green"
          icon="store"
          @click="confirm = true"
          label="Llegué a la tienda"
          v-if="estado === 5 || estado === 4"
        />
        <q-btn
          rounded
          color="green"
          icon="store"
          @click="confirm = true"
          label="Ya tengo los productos"
          v-if="estado === 6"
        />
        <q-btn
          rounded
          color="green"
          icon="store"
          @click="confirm = true"
          label="Llegué al destino"
          v-if="estado === 7"
        />
        <q-btn
          rounded
          color="green"
          icon="store"
          @click="confirm = true"
          label="Entregué los productos"
          v-if="estado === 8"
        />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="confirm" transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">¿Quieres cambiar el estado?</div>
        </q-card-section>
        <q-card-section class="bg-white text-black">
          Le informaremos al cliente el cambio en el estado de la orden
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="No" color="secondary" v-close-popup/>
          <div class="q-pa-sm items-center" style="text-align:right">
            <q-btn
              push
              rounded
              size="sm"
              color="primary"
              icon="check"
              label="Si estoy seguro"
              v-close-popup
              @click="onChangeStatus(id, estado === 4?estado +2:estado + 1)"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty, Filters, Utils} from "../../mixins/index";
import qs from "qs";
import {mapMutations, mapState, mapActions} from "vuex";

export default {
  name: "OrderDetail",
  mounted() {
    this.onRequest();
  },
  mixins: [Loading, Noty, Filters, Utils],
  computed: {
    ...mapState(["updateApp", "coordenadas", "user"]),
    ...mapState("Orders", ["order", "ordersInProgress"])
  },
  methods: {
    ...mapMutations(["SET_UPDATE_APP"]),
    ...mapMutations("Orders", ["SET_ORDERS_IN_PROGRESS"]),
    ...mapActions(["changeStatusOrder"]),
    onRequest() {
      this.showLoading("consultando pedido...");
      const str = qs.stringify({order_id: this.id});
      ServiceApi.get("/orders/detail?" + str)
        .then(response => {
          const {
            status,
            message,
            order,
            directionStore,
            directionClient,
            productsOrder
          } = response.data;
          if (status) {
            this.estado = order.estado_id;
            this.data = order;
            this.directionStore = directionStore;
            this.directionClient = directionClient;
            this.directionStore.distance = this.getKm(this.coordenadas.lat, this.coordenadas.lng, directionStore.lat, directionStore.lng)
            productsOrder.map(productOrder => {
              productOrder.reclamado = productOrder.reclamado === 1;
            });
            this.productsOrder = productsOrder;
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
          this.SET_UPDATE_APP(false);
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
          this.SET_UPDATE_APP(false);
        });
    },
    onChangeStatus(pedido_id, estado) {
      this.showLoading("Estamos realizando los cambios...");
      this.changeStatusOrder({pedido_id, estado})
        .then(response => {
          const {status, message} = response.data;
          if (status) {
            if (estado === 9) {
              this.SET_ORDERS_IN_PROGRESS(this.ordersInProgress - 1);
              this.$router.push("/pending");
            }
            this.estado = estado;
            this.Noty("success", message);
          } else {
            this.Noty("error", message);
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
    onChangeStatusProduct(id) {
      this.showLoading("Estamos realizando los cambios...");
      ServiceApi.post("/orders/change/status/product", {id})
        .then(response => {
          const {status, message} = response.data;
          if (status) {
            this.Noty("success", message);
          } else {
            this.Noty("error", message);
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
    goToWhatssap(phone) {
      window.open(
        "https://api.whatsapp.com/send?phone=57" +
        phone +
        "&text=Hola%20soy%20el%20domiciliario%20" + this.user.nombre + "%20encargado%20del%20pedido%20(" + this.order.pedido_id + ")"
      );
    },
    goCall() {
      window.location = "tel:+57" + this.data.celular;
    },
    navigation() {
      if (this.estado >= 4 && this.estado <= 5) {
        window.open(
          "https://maps.google.com/?q=" +
          this.directionStore.lat +
          "," +
          this.directionStore.lng
        );
      } else if (this.estado === 7) {
        window.open(
          "https://maps.google.com/?q=" +
          this.directionClient.lat +
          "," +
          this.directionClient.lng
        );
      }
    }
  },
  data() {
    return {
      id: this.$router.history.current.params.id,
      confirm: false,
      directionStore: {},
      directionClient: {},
      estado: 5,
      data: {},
      productsOrder: []
    };
  },
  watch: {
    updateApp(newValue, oldValue) {
      if (newValue === true && newValue !== oldValue) {
        this.onRequest();
      }
    }
  }
};
</script>
