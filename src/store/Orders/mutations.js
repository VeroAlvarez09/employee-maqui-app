export function setOrder(state, order) {
  state.order = order;
}

export function SET_ORDERS_IN_PROGRESS(state, ordersInProgress) {
  state.ordersInProgress = ordersInProgress;
}

export function SET_NEW_ORDER(state, value) {
  state.orders = state.orders ? state.orders : [];
  state.orders.push(value.pedidoId);
}

export function DELETE_NEW_ORDER(state, pedidoId) {
  let newOrders = [];
  state.orders.map(i => {
    if (i.pedido_id !== pedidoId) {
      newOrders.push(i);
    }
  });
  state.orders = newOrders;
}
