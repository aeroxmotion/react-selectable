import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    lib: {
      entry: path.resolve(__dirname, '../src/index.ts'),
      formats: ['es'],
      fileName: format => `react-selectable-${format}.js`
    },
    rollupOptions: {
      external: ['react']
    }
  }
})
