// src/mixins/i18nMixin.js

import { useI18n } from 'vue-i18n';

export const i18nMixin = {
  setup() {
    const { t } = useI18n();
    return { t };
  }
};
