import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return {
      base: './',
      plugins: [react()],
      build: {
        outDir: 'demo/dist',
        emptyOutDir: false,
      },
    };
  }

  return {
    plugins: [
      react(),
      dts({
        rollupTypes: true,
      }),
    ],
    preview: {
      outDir: 'demo/dist',
    },
    build: {
      lib: {
        entry: resolve(import.meta.dirname, 'src/index.tsx'),
        name: 'reactJsonView',
        formats: ['es', 'cjs'],
        fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  };
});
