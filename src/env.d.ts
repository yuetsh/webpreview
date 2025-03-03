interface ImportMetaEnv {
  readonly MODE: "production" | "development" | "none"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
