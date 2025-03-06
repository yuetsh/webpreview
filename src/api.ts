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

  async batchCreate(payload: {classname: string, names: string[]}) {
    await http.post("/account/batch", payload)
  }
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
