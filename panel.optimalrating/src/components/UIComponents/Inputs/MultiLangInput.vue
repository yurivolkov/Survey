<template>
  <div class="form-group row multi-lang-input-container">
    <slot name="label">
      <label v-if="label" class="control-label" :class="labelClass">
        {{label}} :
      </label>
    </slot>
    <div :class="inputClass">
      <ul class="nav nav-tabs multi-lang-tabs" :id="tabId" role="tablist">
        <li class="nav-item" v-for="(item, key, index) in items">
          <a class="nav-link" :class="[key == 'tr' ? 'active' : '', typeof items.tr == 'undefined' && index == 0 ? 'active' : '']" :id="key + '-tab'" data-toggle="tab" :href="`#${tabId}-${key}`" role="tab" :aria-controls="key" aria-selected="false">
            <template v-if="key == 'en'"><span class="flag-icon flag-icon-gb"></span> {{key}}</template>
            <template v-else-if="key == 'ar'"><span class="flag-icon flag-icon-ae"></span> {{key}}</template>
            <template v-else><span class="flag-icon" :class="`flag-icon-${key}`"></span> {{key}}</template>
          </a>
        </li>
      </ul>
      <div class="tab-content" :id="tabId + '-content'">
        <div class="tab-pane show" :class="[key == 'tr' ? 'active' : '', typeof items.tr == 'undefined' && index == 0 ? 'active' : '']" :id="`${tabId}-${key}`" role="tabpanel" :aria-labelledby="key + '-tab'" v-for="(item, key, index) in items">
          <vue-editor v-if="editor" :editorToolbar="customToolbar" v-model="items[key]"></vue-editor>
          <textarea v-else class="form-control" v-model="items[key]" rows="3" cols="60"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { VueEditor } from 'vue2-editor'
  export default {
    inheritAttrs: false,
    components: {
      VueEditor
    },
    data(){
      return {
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }]
        ]
      }
    },
    props: {
      label: String,
      value: [String, Number],
      inputClass: String,
      labelClass: String,
      tabId: String,
      items: Object,
      editor: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style>

</style>
