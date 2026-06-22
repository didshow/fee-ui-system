import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // @ 路径别名：import Foo from '@/components/Foo'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // GitHub Pages 部署到 /fee-system/，本地开发为 /
  base: mode === 'h5' ? '/h5/' : (process.env.GITHUB_ACTIONS ? '/fee-system/' : '/'),

  build: {
    // H5 产物输出到 dist-h5/，Web 产物输出到 dist/
    outDir: mode === 'h5' ? 'dist-h5' : 'dist',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // react 相关单独打包，利用浏览器缓存
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // antd-mobile 体积较大，单独拆出
          antd: ['antd-mobile'],
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },
}))
