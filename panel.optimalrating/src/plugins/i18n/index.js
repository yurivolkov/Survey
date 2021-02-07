import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from './locale';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export const langtext = (obj) => {
    return obj[i18n.locale];
};
 Vue.filter('langtext', langtext);

export default i18n;
