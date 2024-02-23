export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  // Redirect '/' to '/website' always
  if (to.fullPath === '/')
    return navigateTo('/website')

  // If user tries to navigate to '/user/personal-details', check if info is already filled
  if (!to.fullPath.includes('/user/personal-details')) {
    const response = await userStore.fetchAddress()
    if (!response || !response.phone_number)
      return navigateTo('/user/personal-details')
  }

  // If user tries to navigate to '/user/personal-details', check if info is already filled
  if (to.fullPath === '/user/personal-details') {
    const response = await userStore.fetchAddress()
    if (response && response.phone_number)
      return navigateTo('/app/diagram/list')
  }
})
