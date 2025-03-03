import axios from "axios"
import { router } from "./router"

const http = axios.create({
  baseURL: "https://webapi.xuyue.cc/api",
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
          localStorage.removeItem("web-isloggedin")
          alert("未登录")
          router.push("/")
          break
        case 403: // 禁止访问
          alert("禁止访问")
          break
        default:
          console.error("出现错误：", err.response.status, err.response.data)
      }
    } else {
      console.error("Network error:", err.message)
    }
    return Promise.reject(err)
  },
)

export async function login(username: string, password: string) {
  const res = await http.post("/account/login", { username, password })
  return res.data
}

export async function logout() {
  const res = await http.post("/account/logout")
  return res.data
}

export async function getMyProfile() {
  const res = await http.get("/account/profile")
  return res.data
}
