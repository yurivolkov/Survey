<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-8">
                <h4 class="mb-4 mt-2">{{title}}</h4>
            </div>
            <div class="col-4">
                <button type="button" name="button" class="btn btn-sm btn-fill btn-round btn-primary float-right mb-2 mt-2" @click="openModal('save')"><i class="fas fa-plus"></i> {{$t('common.buttons.new')}}</button>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <card>
                            <datatable :class="{'loading-table': loading}" v-if="datatable.data" v-bind="datatable" />
                        </card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  export default {

    props:['title', 'loading', 'datatable'],
    components:{
      Card
    },
    methods: {
      openModal(modal){

        this.datatable.xprops.eventbus.$emit('openModal');
      }
    }
  }
</script>
