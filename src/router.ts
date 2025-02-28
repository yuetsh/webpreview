import { createWebHistory, createRouter } from "vue-router"
import { loginModal } from "./store/modal"

import Home from "./pages/Home.vue"
import Protected from "./pages/Protected.vue"

const routes = [
  { path: "/", component: Home },
  {
    path: "/protected",
    name: "protected",
    component: Protected,
    meta: { requiresAuth: true },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("web-isloggedin") === "true"
  if (to.meta.requiresAuth && !isLoggedIn) {
    loginModal.value = true
    next(false)
  } else {
    next() // 允许访问
  }
})
