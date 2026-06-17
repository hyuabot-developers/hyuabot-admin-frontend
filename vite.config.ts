import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/gbis-api': {
                target: 'http://apis.data.go.kr',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/gbis-api/, ''),
            },
        },
    },
})
