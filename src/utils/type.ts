export enum Role {
  Super = "super",
  Admin = "admin",
  Normal = "normal",
}

export interface TutorialSlim {
  display: string
  title: string
  is_public: boolean
}

export interface TutorialIn {
  display: string
  title: string
  content: string
}
