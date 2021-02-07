<template>
    <form @submit.prevent="$emit('submitAction', item)">
        <div class="form-group row">
            <label class="col-4 col-form-label">{{$t('common.page.input.name')}} :</label>
            <div class="col-8">
                <input type="text" class="form-control" v-model="item.title" >
            </div>
        </div>

        <div class="form-group row">
            <label class="col-4 col-form-label">{{$t('common.page.input.body')}} :</label>
            <div class="col-8">
                <vue-editor  :editorToolbar="customToolbar" v-model="item.body"></vue-editor>
            </div>
        </div>

        <div class="form-group row">
            <label class="col-4 col-form-label">{{$t('common.page.input.order')}} :</label>
            <div class="col-8">
                <input type="text" class="form-control" v-model="item.order" >
            </div>
        </div>
    </form>
</template>
<script>
  import { VueEditor } from 'vue2-editor'
  export default {
    props: ['item'],
    components:{
      VueEditor
    },
    data(){
      return {
        customToolbar: [
          ['bold', 'italic', 'underline', 'video'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }]
        ]
      }
    }
  }
</script>
