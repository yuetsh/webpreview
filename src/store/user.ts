import { computed, reactive } from "vue"
import { Role } from "../utils/type"

export const user = reactive({
  loaded: false,
  username: "",
  role: Role.Normal,
})
export const authed = computed(() => !!user.username)
export const roleNormal = computed(() => user.role === Role.Normal)
export const roleAdmin = computed(() => user.role === Role.Admin)
export const roleSuper = computed(() => user.role !== Role.Super)
