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
    runtimeConfig: {
        public: {
            googleMapsApiKey: 'AIzaSyAkVQ9GmgG4F6VNlg-xRe4vy6MOS1IWDPI'
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