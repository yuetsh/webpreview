import { createWebHistory, createRouter } from "vue-router"
import { loginModal } from "./store/modal"

import Home from "./pages/Home.vue"
import { STORAGE_KEY } from "./utils/const"

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/tutorial", name: "home-tutorial-list", component: Home },
  { path: "/tutorial/:display", name: "home-tutorial", component: Home },
  { path: "/challenge", name: "home-challenge-list", component: Home },
  {
    path: "/challenge/:display",
    name: "home-challenge",
    component: () => import("./pages/ChallengeHome.vue"),
  },
  {
    path: "/submissions/:page",
    name: "submissions",
    component: () => import("./pages/Submissions.vue"),
  },
  {
    path: "/submission/:id",
    name: "submission",
    component: () => import("./pages/Submission.vue"),
    props: true,
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: () => import("./pages/Leaderboard.vue"),
  },
  {
    path: "/ranking",
    name: "ranking",
    component: () => import("./pages/Ranking.vue"),
    meta: { auth: true },
  },
  {
    path: "/my-scores",
    name: "my-scores",
    component: () => import("./pages/MyScores.vue"),
    meta: { auth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("./pages/Dashboard.vue"),
    meta: { auth: true },
    children: [
      {
        path: "tutorial/:display",
        name: "tutorial-editor",
        component: () => import("./pages/TutorialEditor.vue"),
      },
      {
        path: "challenge/:display",
        name: "challenge-editor",
        component: () => import("./pages/ChallengeEditor.vue"),
      },
      {
        path: "user-manage/:page",
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
