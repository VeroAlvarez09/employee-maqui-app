import MainLayout from "layouts/MainLayout";
import PageIndex from "../pages/Index";
import Pending from "../pages/EnCurso";
import Login from "../pages/Login";
import Register from "../components/Login/Register";
import PageProfile from "pages/PageProfile";
import ModalOrder from "../components/Pedidos/ModalOrder";
import LoginLayout from "../layouts/LoginLayout.vue";
import ResetPassword from "components/Login/ResetPassword";
const routes = [
  {
    path: "",
    component: LoginLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: Login
      },
      {
        path: "/register",
        name: "registro",
        component: Register
      },
      {
        path: "/reset/password",
        name: "reset_password",
        component: ResetPassword
      }
    ]
  },
  {
    path: "",
    component: MainLayout,
    children: [
      {
        path: "/pending",
        name: "pending",
        component: PageIndex
      },
      {
        path: "/progress",
        name: "progress",
        component: Pending
      },
      {
        path: "/order",
        name: "order",
        component: ModalOrder
      },
      {
        path: "/profile",
        name: "profile",
        component: PageProfile
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: MainLayout,
    children: [{ path: "", component: PageIndex }]
  });
}

export default routes;
