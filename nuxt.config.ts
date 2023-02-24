// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=500, initial-scale=1',
      title: 'zzh Blog',
      meta: [
        // <meta name="description" content="My amazing site">
        { name: 'description', content: 'zzh’s blog site.' }
      ],
    }
  },

  modules: [
    '@nuxt/content',
    '@element-plus/nuxt',
    'nuxt-windicss',
    '@pinia/nuxt',
  ],

  css: [
    '@/assets/style/index.scss',
    'virtual:windi.css',
    'virtual:windi-devtools',
  ],

  windicss: {
    analyze: {
      analysis: {
        interpretUtilities: false,
      },
      // see https://github.com/unjs/listhen#options
      server: {
        port: 4444,
        open: false,
      }
    }
  },

  content: {
    highlight: {
      // Theme used in all color schemes.
      // theme: 'github-light'
      // OR
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
      },
      preload: [
        'nginx'
      ]
    }
  },

  imports: {
    dirs: ['./stores'],
  },

  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@import "@/assets/style/index.scss"',
        },
      },
    },
  },
})
