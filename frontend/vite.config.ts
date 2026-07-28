import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 프론트가 /api 로 호출하면 same-origin 이 되어 세션 쿠키가 first-party 로 오간다.
// 프록시가 백엔드(9090)로 넘길 때 /api 프리픽스를 제거한다(백엔드는 /auth, /me ... 로 서빙).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
