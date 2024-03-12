export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  // Redirect '/' to '/website' always
  if (to.fullPath === '/')
    return navigateTo('/website')

  // If user tries to navigate to '/user/personal-details', check if info is already filled
  if (to.fullPath === '/user/personal-details') {
    userStore.fetchAddress().then((response) => {
      if (response?.userAddress[0]?.phone_number)
        return navigateTo('/app/diagram/list')
      return navigateTo('/user/personal-details')
    })
  }

  // If user tries to navigate to other than '/user/personal-details', check if info is not filled already
  else {
    userStore.fetchAddress().then((response) => {
      if (!response?.userAddress[0]?.phone_number)
        return navigateTo('/user/personal-details')
    })
  }
})
