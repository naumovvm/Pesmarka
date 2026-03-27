import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { telefunc as telefuncPlugin } from 'telefunc/vite'
import { telefuncHandler } from './server/telefunc-handler'

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'telefunc-context',
            configureServer(server) {
                server.middlewares.use('/_telefunc', async (req, res) => {
                    const suffix = req.url ?? '';
                    req.url = ('/_telefunc' + suffix).replace(/\/$/, ''); // strip trailing slash
                    await telefuncHandler(req, res);
                });

            }
        },
        telefuncPlugin(),
    ],
})
