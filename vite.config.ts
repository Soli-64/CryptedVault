// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {loadConfig} from "versapy/config"
import path from "path"

export default defineConfig(async () => {
  const config = await loadConfig()
  const {port, host} = config.frontend
  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: { port, host },
    base: "./"
  }
})