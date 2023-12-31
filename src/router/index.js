import Vue from "vue";
import VueRouter from "vue-router";
import ServiceApi from "../helpers/ServiceApi";
import routes from "./routes";
import store from "../store/index";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({store, ssrContext}) {
  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,
    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: "history",
    base: "/"
  });
  Router.beforeEach((to, from, next) => {
    if (to.path !== "/login" && to.path !== "/register" && to.path !== "/reset/password") {
      ServiceApi.post("/user/validate/session")
        .then(response => {
          store.commit("SET_USER", response.data);
          next();
        })
        .catch(err => {
          next({
            path: "/login"
          });
        });
    } else {
      next();
    }
  });
  return Router;
}
