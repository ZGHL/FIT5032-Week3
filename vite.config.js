import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // ⚠️ 填你的仓库名
  base: '/FIT5032-Week3/',
})