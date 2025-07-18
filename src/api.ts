import axios from "axios"
import { router } from "./router"
import type { TutorialIn } from "./utils/type"
import { BASE_URL, STORAGE_KEY } from "./utils/const"

const http = axios.create({
  baseURL: BASE_URL,
  xsrfCookieName: "xsrfCookieName",
  xsrfHeaderName: "X-CSRFTOKEN",
  withCredentials: true,
})

http.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 401: // 未授权
          localStorage.removeItem(STORAGE_KEY.LOGIN)
          router.push("/")
          break
        case 403: // 禁止访问
          alert("权限不够，禁止访问")
          router.push("/")
          break
        default:
          console.error("出现错误：", err.response.status, err.response.data)
      }
    } else {
      console.error("出现错误：", err.message)
    }
    return Promise.reject(err)
  },
)

export const Account = {
  async login(username: string, password: string) {
    const res = await http.post("/account/login", { username, password })
    return res.data
  },

  async logout() {
    const res = await http.post("/account/logout")
    return res.data
  },

  async getMyProfile() {
    const res = await http.get("/account/profile")
    return res.data
  },

  async list(query: { username: string; page: number }) {
    const res = await http.get("/account/list", {
      params: query,
    })
    return res.data
  },

  async toggleActive(id: number) {
    const res = await http.put(`/account/active/${id}`)
    return res.data
  },

  async batchCreate(payload: { classname: string; names: string[] }) {
    const res = await http.post("/account/batch", payload)
    return res.data
  },
}

export const Tutorial = {
  async list() {
    const res = await http.get("/tutorial/list")
    return res.data
  },

  async createOrUpdate(payload: TutorialIn) {
    const res = await http.post("/tutorial/", payload)
    return res.data
  },

  async togglePublic(display: number) {
    const res = await http.put(`/tutorial/public/${display}`)
    return res.data
  },

  async remove(display: number) {
    await http.delete(`/tutorial/${display}`)
  },

  async get(display: number) {
    const res = await http.get(`/tutorial/${display}`)
    return res.data
  },

  async listDisplay() {
    const res = await http.get("/tutorial/display")
    return res.data
  },
}

export const Submission = {
  async create(
    taskId: number,
    code: {
      html?: string
      css?: string
      js?: string
    },
  ) {
    const data = { task_id: taskId, ...code }
    const res = await http.post("/submission/", data)
    return res.data
  },

  async list(query: { page: number }) {
    const res = await http.get("/submission", {
      params: query,
    })
    return res.data
  },

  async get(id: string) {
    const res = await http.get("/submission/" + id)
    return res.data
  },

  async updateScore(id: string, score: number) {
    const res = await http.put(`/submission/${id}/score`, { score })
    return res.data
  },
}

export const Helper = {
  async upload(file: File) {
    const form = new window.FormData()
    form.append("image", file)
    const res = await http.post("/upload/", form, {
      headers: { "content-type": "multipart/form-data" },
    })
    return !!res.data.url ? res.data.url : ""
  },
}
