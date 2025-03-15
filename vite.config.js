/* This code snippet is configuring a Vite project, which is a build tool for modern web development.
Here's a breakdown of what the code is doing: */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/deployconectoweb/",
});
