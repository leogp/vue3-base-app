import { ref, watch } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

watch(isDark, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
  }
  return { isDark, toggle }
}
