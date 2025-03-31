export default defineNuxtRouteMiddleware((to, from) => {
    const authToken = useCookie('auth_token')
    if (!authToken.value && to.path !== '/login') {
        return navigateTo('/login')
    } else if (authToken.value && to.path === '/login') {
        return navigateTo('/')
    }
})
