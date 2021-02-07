import fgInput from 'src/components/UIComponents/Inputs/formGroupInput.vue';
import DropDown from 'src/components/UIComponents/Dropdown.vue';
import Switches from 'vue-switches';
import Vue2Dropzone from 'vue2-dropzone';
import Datepicker from 'vuejs-datepicker';
import Treeselect from '@riophae/vue-treeselect'

const GlobalComponents = {
  install(Vue) {
    Vue.component('fg-input', fgInput);
    Vue.component('drop-down', DropDown);
    Vue.component('switches', Switches);
    Vue.component('dropzone', Vue2Dropzone);
    Vue.component('datepicker', Datepicker);
    Vue.component('treeselect', Treeselect);
  },
};

export default GlobalComponents;
