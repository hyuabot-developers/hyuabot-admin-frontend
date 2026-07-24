import react from '@vitejs/plugin-react-swc'
import { defineConfig, ProxyOptions } from 'vite'

const apiProxy: ProxyOptions = {
    target: 'https://backend.hyuabot.app',
    changeOrigin: true,
    headers: {
        Origin: 'https://dashboard.hyuabot.app',
    },
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': apiProxy,
            '/gbis-api': {
                target: 'http://apis.data.go.kr',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/gbis-api/, ''),
            },
        },
    },
})
