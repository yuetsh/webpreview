export enum Role {
  Super = "super",
  Admin = "admin",
  Normal = "normal",
}

export function getRole(role: Role) {
  return {
    [Role.Super]: "超级管理员",
    [Role.Admin]: "管理员",
    [Role.Normal]: "普通用户",
  }[role]
}

export interface TutorialSlim {
  display: number
  title: string
  is_public: boolean
}

export interface TutorialReturn extends TutorialSlim {
  content: string
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
