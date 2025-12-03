import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 使用相对路径，确保在 GitHub Pages 下能找到资源
  base: './', 
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // 将警告阈值调到极大，彻底忽略"文件过大"的警告，专注于程序能跑通
    chunkSizeWarningLimit: 2000, 
    rollupOptions: {
      output: {
        // 彻底移除 manualChunks，让 Vite 自动处理。
        // 这虽然会让文件变大，但能保证在 GitHub Pages 上 100% 加载成功。
        manualChunks: undefined,
      },
    },
  },
  server: {
    open: true,
  }
});