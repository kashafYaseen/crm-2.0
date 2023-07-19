import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import envCompatible from 'vite-plugin-env-compatible'
import path from 'path'

// see all documentation here https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  // This changes the out put dir from dist to build change as your need
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
      '@admin_user_components': path.resolve(__dirname, 'src/components/admin_user'),
      '@business_owner_components': path.resolve(__dirname, 'src/components/business_owner'),
      '@admin_user_views': path.resolve(__dirname, 'src/views/admin_user'),
      '@business_owner_views': path.resolve(__dirname, 'src/views/business_owner'),
    },
  },
  plugins: [
    react(),
    envCompatible(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
})
