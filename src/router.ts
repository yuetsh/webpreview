import { createWebHistory, createRouter } from "vue-router"
import { loginModal } from "./store/modal"

import Home from "./pages/Home.vue"
import { STORAGE_KEY } from "./utils/const"

const routes = [
  { path: "/", name: "home", component: Home },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("./pages/Dashboard.vue"),
    meta: { auth: true },
    children: [
      {
        path: "tutorial",
        name: "tutorial",
        component: () => import("./pages/Markdown.vue"),
      },
      {
        path: "user-manage",
        name: "user-manage",
        component: () => import("./pages/UserManage.vue"),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem(STORAGE_KEY.LOGIN) === "true"
  if (to.meta.auth && !isLoggedIn) {
    loginModal.value = true
    next(false)
  } else {
    next()
  }
})
