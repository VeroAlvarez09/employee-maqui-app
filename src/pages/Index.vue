<template>
  <q-page class="flex-center bg-grey-2">
    <pedidos-pendientes/>
  </q-page>
</template>

<script>
  import PedidosPendientes from "components/Pedidos/Pendientes";
  export default {
    name: "PageIndex",
    components: {PedidosPendientes},
  };
</script>
