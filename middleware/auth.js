export default defineNuxtRouteMiddleware((to, from) => {
    const authToken = useCookie('auth_token')
    if (!authToken.value && to.path !== '/login') {
        console.log(1)
        return navigateTo('/login')
    } else if (authToken.value && to.path === '/login') {
        console.log(2)
        return navigateTo('/')
    }
})
