export enum Role {
  Super = "super",
  Admin = "admin",
  Normal = "normal",
}

export interface TutorialSlim {
  display: number
  title: string
  is_public: boolean
}

export interface TutorialIn {
  display: number
  title: string
  content: string
}

export interface User {
  username: string
  date_joined: Date
  last_login: Date
  role: Role
  is_active: boolean
}