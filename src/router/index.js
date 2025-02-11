import { createRouter, createWebHashHistory } from "vue-router";
import BusinessView from "../views/BusinessView.vue";
import ManagementView from "../views/ManagementView.vue";
import ServiceView from '../views/ServiceView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/business"
    },
    {
      path: "/business",
      name: "business",
      component: BusinessView,
    },
    {
      path: "/management",
      name: "management",
      component: ManagementView,
    },
    {
      path: '/service',
      name: 'service',
      component: ServiceView
    }
  ],
});

export default router;
