import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8100",

    includeShadowDom: true,
    experimentalShadowDomSupport: true,

    setupNodeEvents(on, config) {
      return config;
    },
  },
});