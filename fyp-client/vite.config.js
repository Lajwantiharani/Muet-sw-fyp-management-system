import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Shim for __dirname in ESM context:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // server: {
  //   host: true,
  //   port: 5173,
  // },
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@app": path.resolve(__dirname, "src/app"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@schemas": path.resolve(__dirname, "src/schemas"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@services": path.resolve(__dirname, "src/services"),
      "@config": path.resolve(__dirname, "src/config"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@loaders": path.resolve(__dirname, "src/routes/loaders"),
      "@data": path.resolve(__dirname, "src/data"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
});
