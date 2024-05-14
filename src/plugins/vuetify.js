// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import 'vuetify/styles';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});
    