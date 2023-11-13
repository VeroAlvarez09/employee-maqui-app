<template>
  <q-page class="flex-center bg-grey-2">
    <order-detail/>
  </q-page>
</template>

<script>
  import OrderDetail from "components/Pedidos/Detail";
  export default {
    name: "PageOrderDetail",
    components: {OrderDetail},
  };
</script>
