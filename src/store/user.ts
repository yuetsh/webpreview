import { computed, ref } from "vue"

export const username = ref("")
export const authed = computed(() => !!username.value)
