export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()
  const subscriptionStore = useSubscriptionStore()

//  if(!to.fullPath.includes('/website') ){
//   subscriptionStore.fetchActivePlan().then((response)=>{
//     // console.log("plan",response.subscription_status);
//      if(response?.subscription_status === 'PLAN_EXPIRED')
//     console.log("plan",response.subscription_status);

//      return navigateTo('/website/pricing')
//    }
//   )}
  // Redirect '/' to '/website' always
  if (to.fullPath === '/')
    return navigateTo('/website')

  // If user tries to navigate to '/user/personal-details', check if info is already filled
  if (to.fullPath === '/user/personal-details') {
    userStore.fetchAddress().then((response) => {
      if (response?.phone_number)
        return navigateTo('/app/diagram/list')
      return navigateTo('/user/personal-details')
    })
  }

  // If user tries to navigate to other than '/user/personal-details', check if info is not filled already
  else {
    userStore.fetchAddress().then((response) => {
      if (!response?.phone_number)
        return navigateTo('/user/personal-details')
    })
  }
  // if(to.fullPath ==='/website/pricing'){
    // subscriptionStore.fetchActivePlan().then((response)=>{
    //   console.log("plan",response.subscription_status);
    //    if(response?.subscription_status === 'PLAN_EXPIRED')
    //    return navigateTo('/website/pricing')
    //  }
    // )
  // }
})
