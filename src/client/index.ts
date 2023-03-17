import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { aliases, mdi } from "vuetify/iconsets/mdi";

import { setBaseUrl } from "./api/api";
setBaseUrl("http://localhost:5290");

import mcu from './root.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  }
});

createApp({
  components: {
    "mcu": mcu
  },
  template: "<mcu />"
})
 .use(vuetify)
 .mount("#app");