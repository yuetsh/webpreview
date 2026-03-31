import type { TASK_TYPE } from "./const"

export interface PromptMessage {
  id: number
  role: string
  content: string
  code_html: string | null
  code_css: string | null
  code_js: string | null
  prompt_level?: number | null
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
  flag?: FlagType
  zone?: "featured" | "low" | "pending" | null
  submit_count: number
  view_count: number
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
  submit_count: number
  view_count: number
  created: Date
  modified: Date
}

export interface UserTag {
  username: string
  classname: string
}

export interface SubmissionCountBucket {
  count_1: number
  count_2: number
  count_3: number
  count_4_plus: number
}

export interface ScoreBucket {
  range_1_2: number
  range_2_3: number
  range_3_4: number
  range_4_5: number
  range_5: number
}

export interface FlagStats {
  red: number
  blue: number
  green: number
  yellow: number
}

export interface TaskStatsOut {
  submitted_count: number
  unsubmitted_count: number
  average_score: number | null
  unrated_count: number
  unsubmitted_users: UserTag[]
  unrated_users: UserTag[]
  submission_count_distribution: SubmissionCountBucket
  score_distribution: ScoreBucket
  flag_stats: FlagStats
  classes: string[]
}
