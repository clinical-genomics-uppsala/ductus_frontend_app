//import { createRouter, createMemoryHistory } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import AnalysisView from "@/views/AnalysisView.vue";
import DashboardView from "@/views/DashboardView.vue";
import LogInView from "@/views/LogInView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import SequenceRunView from "@/views/SequenceRunView.vue";
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
    path: "/sequencerun/:id",
    name: "SequenceRun",
    component: SequenceRunView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/analysis/:id",
    name: "Analysis",
    component: AnalysisView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/",
    redirect: "/dashboard",
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "4044",
    component: NotFoundView,
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  console.log({ to, from });
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
