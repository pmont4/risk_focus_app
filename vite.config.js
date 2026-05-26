import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import path from 'path';

export default defineConfig(({ mode }) => {

  const externalEnvDir = path.resolve(__dirname, '..');
  const env = loadEnv(mode, externalEnvDir, '');

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    envDir: externalEnvDir,
    base: '/',
    build: {
      outDir: 'dist'
    },
    server: {
      port: parseInt(env.REACT_APP_PORT) || 5173,
      proxy: {
        '/riskfocus/': {
          target: env.REACT_APP_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});