import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            {
              // https://svgo.dev/docs/preset-default/
              name: "preset-default",
              params: {
                overrides: {
                  cleanupIds: {
                    // Do not minify IDs to prevent them from being similar.
                    // See more:
                    // https://svgo.dev/docs/plugins/cleanupIds/
                    minify: false,
                  },
                },
              },
            },
            // Remove these since we are inlining SVGs.
            // See more:
            // https://svgo.dev/docs/plugins/removeXMLNS/
            // https://svgo.dev/docs/plugins/removeXlink/
            "removeXMLNS",
            {
              name: "removeXlink",
              params: {
                includeLegacy: true,
              },
            },
          ],
        },
      },
    }),
  ],
});
