import Moment from "moment";

export const Loading = {
  methods: {
    showLoading(message) {
      this.$q.loading.show({
        message: message
      });
    },
    hideLoading() {
      this.$q.loading.hide();
    }
  }
};
export const Noty = {
  methods: {
    NotyHtml(icon, title, message, timeout = 10000) {
      this.$q.notify({
        timeout,
        color: "white",
        position: "center",
        message: `<div style="background-color: white;" class="items-center justify-center column text-center">
        <div class="full-width text-center text-grey-7">
          <div class="text-h6 text-bold ft">${title}</div>
        </div>
      </div>
      <div class="full-width text-center text-grey-7" style="background-color: white;">
        <div class="text-subtitle2" style="max-width: 400px; margin: auto;">
          ${message}
        </div>
      </div>`,
        html: true
      });
    },
    Noty(type, message, position = "top", f = null) {
      switch (type) {
        case "success":
          this.$q.notify({
            type: "positive",
            message,
            position
          });
          break;
        case "warning":
          this.$q.notify({
            type: "warning",
            message,
            position
          });
          break;
        case "error":
          this.$q.notify({
            type: "negative",
            message,
            position
          });
          break;
        case "info":
          this.$q.notify({
            type: "info",
            message,
            position
          });
          break;
        case "order":
          this.$q.notify({
            type: "positive",
            position: "top-right",
            icon: "check",
            timeout: 10000,
            message,
            color: "green",
            actions: [
              {
                label: "Aceptar",
                color: "yellow",
                handler: f
              }
            ],
            html: true
          });
      }
    }
  }
};

export const Filters = {
  filters: {
    currency(value) {
      if (value) {
        if (value !== undefined) {
          return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        }
      }
      return "";
    },
    dateFormat(value) {
      return Moment(value).format("DD-MM-YYYY");
    },
    hourFormat(value) {
      return Moment(value).format("LT");
    },
    diffDate(date, now = Moment()) {
      if (date) {
        const before = Moment(date);
        return now.diff(before, "minutes");
      }
      return "";
    }
  }
};
