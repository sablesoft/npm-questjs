import { resolve } from 'path';
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        minify: false,
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
