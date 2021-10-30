import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ExportEnvJson } from '../dist';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    ExportEnvJson()
  ],

  // dotenv
  envDir: '.env',
  envPrefix: 'W6S_',
})
