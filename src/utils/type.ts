import type { TASK_TYPE } from "./const"

export interface PromptMessage {
  id: number
  role: string
  content: string
  code_html: string | null
  code_css: string | null
  code_js: string | null
  created: string
}

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

export type FlagType = "red" | "blue" | "green" | "yellow" | null

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

export interface ChallengeSlim {
  display: number
  title: string
  score: number
  is_public: boolean
}

export interface ChallengeIn {
  display: number
  title: string
  content: string
  score: number
  is_public: boolean
}

export interface User {
  id: number
  username: string
  date_joined: Date
  last_login: Date
  role: Role
  is_active: boolean
}

export interface SubmissionOut {
  id: string
  userid: number
  username: string
  task_id: number
  task_display: number
  task_type: TASK_TYPE
  task_title: string
  score: number
  my_score: number
  conversation_id?: string
  flag?: FlagType
  nominated: boolean
  submit_count: number
  created: Date
  modified: Date
}

export interface SubmissionAll {
  id: string
  userid: number
  username: string
  task_id: number
  task_display: number
  task_type: TASK_TYPE
  task_title: string
  score: number
  my_score: number
  flag?: FlagType
  html: ""
  css: ""
  js: ""
  created: Date
  modified: Date
}
