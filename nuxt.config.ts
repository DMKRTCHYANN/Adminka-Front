// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    css: [
        '@/assets/css/tailwind.css'
    ],
    devtools: {
        enabled: true
    },
    modules: [
        'nuxt-proxy', '@nuxt/ui'
    ],
    // plugins: [
    //     '~/plugins/ckeditor.client.js'
    // ],
    // build: {
    //     transpile: [
    //         '@ckeditor/ckeditor5-vue'
    //     ],
    // },
    nitro: {
        devProxy: {
            "/api/": {
                target: process.env.BACKEND_URL,
                changeOrigin: true
            },
        }
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
})