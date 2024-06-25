export function useMobileScreen() {
  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  const truncateTitle = (title: string, length: number = 20) => {
    if (isMobile.value && title.length > length)
      return `${title.slice(0, length)}...`

    return title
  }

  return {
    isMobile,
    truncateTitle,
  }
}
