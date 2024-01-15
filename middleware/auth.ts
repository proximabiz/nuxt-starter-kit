import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const accessToken = authStore.session.access_token

  if (to.fullPath.includes('/auth') && accessToken)
    return navigateTo('/')

  if (!to.fullPath.includes('/auth') && !accessToken)
    return navigateTo({
      path: '/auth',
      query: {
        action: 'signin'
      }
    })
})
