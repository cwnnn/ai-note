import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArchiveView from "../views/ArchiveView.vue";
import TrashView from "../views/TrashView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        showHeaderButton: true,
      },
    },
    {
      path: "/archive",
      name: "archive",
      component: ArchiveView,
      meta: {
        showHeaderButton: false,
      },
    },
    {
      path: "/trash",
      name: "trash",
      component: TrashView,
      meta: {
        showHeaderButton: false,
      },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 128,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

export default router;
