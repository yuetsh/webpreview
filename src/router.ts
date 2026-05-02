import { createWebHistory, createRouter } from "vue-router"
import { loginModal } from "./store/modal"

import Workspace from "./pages/Workspace.vue"
import { STORAGE_KEY } from "./utils/const"

const routes = [
  { path: "/", name: "home", component: Workspace },
  { path: "/tutorial", name: "home-tutorial-list", component: Workspace },
  { path: "/tutorial/:display", name: "home-tutorial", component: Workspace },
  { path: "/challenge", name: "home-challenge-list", component: Workspace },
  {
    path: "/challenge/:display",
    name: "home-challenge",
    component: () => import("./pages/ChallengeDetail.vue"),
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
    path: "/showcase",
    name: "showcase",
    component: () => import("./pages/Showcase.vue"),
    meta: { auth: true },
  },
  {
    path: "/showcase/:id",
    name: "showcase-detail",
    component: () => import("./pages/ShowcaseDetail.vue"),
    props: true,
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
      {
        path: "showcase",
        name: "showcase-manage",
        component: () => import("./pages/ShowcaseManage.vue"),
      },
      {
        path: "gradebook",
        name: "gradebook",
        component: () => import("./pages/Gradebook.vue"),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem(STORAGE_KEY.LOGIN) === "true"
  if (to.meta.auth && !isLoggedIn) {
    loginModal.value = true
    return false
  }
})
