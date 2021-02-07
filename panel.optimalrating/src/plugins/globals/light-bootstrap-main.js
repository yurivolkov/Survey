import VTooltip from 'v-tooltip';
import Notifications from 'vue-notifyjs';
import Multiselect from 'vue-multiselect';
import ToggleButton from 'vue-js-toggle-button';
import VModal from 'vue-js-modal';
import Datatable from 'vue2-datatable-component';
import locale from 'src/plugins/vue2-datatable/vue2-datatable-locale';
import moment from 'vue-moment';
import GlobalComponents from './globalComponents';
import GlobalDirectives from './globalDirectives';
import VueCurrencyFilter from 'vue-currency-filter'
import SideBar from 'src/components/UIComponents/SidebarPlugin';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'flag-icon-css/css/flag-icon.min.css';
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'vue-notifyjs/themes/default.scss';
import 'src/assets/sass/theme.scss';
import 'src/assets/sass/_override.scss';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'es6-promise/auto';

export default {
  install(Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(SideBar);
    Vue.use(Notifications);
    Vue.use(VTooltip);
    Vue.use(ToggleButton);
    Vue.use(moment);
    Vue.use(VModal, {dialog: true});
    Vue.component('multiselect', Multiselect);
    Vue.use(Datatable, {locale});
    Vue.use(VueCurrencyFilter,
    {
      symbol : '₺',
      fractionCount: 2,
      thousandsSeparator: '.',
      fractionSeparator: ',',
      symbolPosition: 'end',
      symbolSpacing: true
    });
 }
};
