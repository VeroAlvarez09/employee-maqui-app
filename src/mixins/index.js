import Moment from "moment";
import S3 from "aws-s3";
import Compressor from "compressorjs";

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
        <img
          style="height:50px"
          src="https://ikiero.s3.amazonaws.com/Recursos+ikiero/icons/${icon}.png"
          alt
        />
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

export const Scroll = {
  methods: {
    toId(id) {
      var element = document.getElementById(id);
      if (element) {
        element.scrollIntoView(true);
        window.scrollBy(0, -30);
      }
    }
  }
};

export const Utils = {
  methods: {
    getKm(lat1, lon1, lat2, lon2) {
      const rad = x => {
        return (x * Math.PI) / 180;
      };
      let R = 6378.137; //Radio de la tierra en km
      let dLat = rad(lat2 - lat1);
      let dLong = rad(lon2 - lon1);
      let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) *
          Math.cos(rad(lat2)) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      return d.toFixed(2); //Retorna tres decimales
    },
    isNumero(val) {
      if (!isNaN(val)) {
        return false;
      }
      return true;
    }
  }
};

export const AmazonS3 = {
  data() {
    return {
      config: {
        bucketName: process.env.VUE_APP_BUCKET_NAME,
        dirName: process.env.VUE_APP_DIR_NAME,
        region: process.env.VUE_APP_REGION,
        accessKeyId: process.env.VUE_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY,
        s3Url: process.env.VUE_APP_S3_URL
      }
    };
  },
  methods: {
    uploadFile(file, fileName, dir) {
      return new Promise((resolve, reject) => {
        this.comprimirArchivo(file)
          .then(result => {
            this.config.dirName = this.isTesting()
              ? "Pruebas/" + dir
              : "Produccion/" + dir;
            const S3Client = new S3(this.config);
            S3Client.uploadFile(result, fileName)
              .then(data => {
                resolve(data.location);
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(e => reject(e));
      });
    },
    uploadFileArchivo(file, fileName, dir) {
      return new Promise((resolve, reject) => {
        this.config.dirName = this.isTesting()
          ? "Pruebas/" + dir
          : "Produccion/" + dir;
        const S3Client = new S3(this.config);
        const newFileName = fileName;
        S3Client.uploadFile(file, newFileName)
          .then(data => {
            resolve(data.location);
          })
          .catch(err => reject(err));
      });
    },
    isTesting() {
      if (window.location.hostname === "domis.ikiero.com") {
        return false;
      } else {
        return true;
      }
    },
    comprimirArchivo(file) {
      return new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6,
          maxWidth: 1920,
          maxHeight: 1280,
          minWidth: 350,
          minHeight: 350,
          convertSize: 2000000,
          success(result) {
            resolve(result);
          },
          error(err) {
            reject(err);
          }
        });
      });
    }
  }
};
