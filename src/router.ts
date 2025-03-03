import { createWebHistory, createRouter } from "vue-router"
import { loginModal } from "./store/modal"

import Home from "./pages/Home.vue"

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
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("web-isloggedin") === "true"
  if (to.meta.auth && !isLoggedIn) {
    loginModal.value = true
    next(false)
  } else {
    next()
  }
})
