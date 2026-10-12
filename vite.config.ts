import { defineConfig } from "vite";

/* O three/webgpu usa "top-level await" e recursos novos: o alvo é o dos
   navegadores com WebGPU ou WebGL2 de hoje. */
export default defineConfig({
  build: { target: "es2022", chunkSizeWarningLimit: 1600 },
  server: { port: 5190 },
  preview: { port: 5191 },
});
