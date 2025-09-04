interface ImportMetaEnv {
  readonly PUBLIC_WEB_URL: string
  readonly PUBLIC_BASE_URL: string
  readonly PUBLIC_ADMIN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
