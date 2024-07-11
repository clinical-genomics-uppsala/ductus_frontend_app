import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import LogInView from "../views/LogInView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import store from "../store/index.js";

const routes = [
  {
    path: "/log-in",
    name: "LogIn",
    component: LogInView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: NotFoundView,
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  if (to.meta.requiresAuth) {
    const isAuthenticated = store.state.isAuthenticated;

    if (isAuthenticated) {
      next();
    } else {
      next({ path: "/log-in", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});
export default router;
