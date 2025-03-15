/* This code snippet is configuring a Vite project, which is a build tool for modern web development.
Here's a breakdown of what the code is doing: */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue")) {
              return "vue"; // Separar Vue en su propio chunk
            }
            return "vendor"; // Agrupar el resto de librerías en otro chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Evita la advertencia de tamaño
  },
  server: {
    port: 5173, // Opcional: cambia el puerto si el 3000 está ocupado
  },
  base: "./", // Importante para despliegue en Netlify
});
