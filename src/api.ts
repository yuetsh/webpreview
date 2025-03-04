import axios from "axios"
import { router } from "./router"
import type { TutorialIn } from "./utils/type"
import { STORAGE_KEY } from "./utils/const"

const http = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api"
      : "https://web.xuyue.cc/api",
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

export class Account {
  static async login(username: string, password: string) {
    const res = await http.post("/account/login", { username, password })
    return res.data
  }

  static async logout() {
    const res = await http.post("/account/logout")
    return res.data
  }

  static async getMyProfile() {
    const res = await http.get("/account/profile")
    return res.data
  }

  static async list(query: { username: string }) {
    const res = await http.get("/account/list", {
      params: query,
    })
    return res.data
  }
}

export class Tutorial {
  static async list() {
    const res = await http.get("/tutorial/")
    return res.data
  }

  static async createOrUpdate(payload: TutorialIn) {
    const res = await http.post("/tutorial/", payload)
    return res.data
  }

  static async togglePublic(display: number) {
    const res = await http.put(`/tutorial/public/${display}`)
    return res.data
  }

  static async remove(display: number) {
    await http.delete(`/tutorial/${display}`)
  }

  static async get(display: number) {
    const res = await http.get(`/tutorial/${display}`)
    return res.data
  }

  static async listDisplay() {
    const res = await http.get("/tutorial/display")
    return res.data
  }
}
