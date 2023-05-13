import { resolve } from 'path';
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        minify: true,
        manifest: true,
        emptyOutDir: false,
        outDir: "dist",
        sourcemap: true,
        lib: {
            name: 'quest',
            entry: {
                quest: resolve(__dirname, 'src/index.js'),
            }
        },
    },
});
