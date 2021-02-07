import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resources from './locales';

const fallbackLng = 'en';

let country = localStorage.getItem('country');

let lng = country ? country === 'null' ? 'en' : country : 'en';

i18n.use(initReactI18next).init({ lng, fallbackLng, resources });