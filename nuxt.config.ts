// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    vite: {
        optimizeDeps: {
            include: [
                "@fawmi/vue-google-maps",
                "fast-deep-equal"
            ]
        }
    },
    css: [
        '@/assets/css/tailwind.css'
    ],
    plugins: [
        '~/plugins/vue-google-maps.client.js'
    ],
    devtools: {
        enabled: true
    },
    modules: [
        'nuxt-proxy', '@nuxt/ui'
    ],
    runtimeConfig: {
        public: {
            googleMapsApiKey: 'AIzaSyDZrlzgVNXCPNCv-pGTjYN-Ic_DofQk8gE'
        }
    },
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
    build: {
        transpile: ['@tiptop/vue-3', '@tiptop/pm']
    },
});