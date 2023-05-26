import {fileURLToPath, URL} from 'node:url';

import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build: {
      manifest: true,
      sourcemap: true,
    },
    plugins: [vue(), vueJsx()],
    base: env.VITE_NACSOS_BASE_URL,
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/main.ts',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});
