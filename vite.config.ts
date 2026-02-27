import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

function autoVideosJson(): Plugin {
  let root: string

  function generate() {
    const videosDir = path.resolve(root, 'public/videos')
    const outputPath = path.resolve(root, 'public/videos.json')
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true })
    }
    const files = fs.readdirSync(videosDir)
      .filter(f => /\.mp4$/i.test(f))
      .sort()
    const videos = files.map(f => ({
      filename: f,
      title: f
        .replace(/\.mp4$/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()),
    }))
    fs.writeFileSync(outputPath, JSON.stringify(videos, null, 2) + '\n')
  }

  return {
    name: 'auto-videos-json',
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      generate()
    },
    configureServer(server) {
      generate()
      const videosDir = path.resolve(root, 'public/videos')
      server.watcher.on('all', (_event, filePath) => {
        if (filePath.startsWith(videosDir) && /\.mp4$/i.test(filePath)) {
          generate()
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}

export default defineConfig({
  base: '/Youtube-PWA/',
  plugins: [
    react(),
    autoVideosJson(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'videos.json', 'videos/*.mp4'],
      manifest: {
        name: 'YouTube',
        short_name: 'YouTube',
        description: 'YouTube Shorts',
        theme_color: '#0f0f0f',
        background_color: '#0f0f0f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/Youtube-PWA/',
        scope: '/Youtube-PWA/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
})
