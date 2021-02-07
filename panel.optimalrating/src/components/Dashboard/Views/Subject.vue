<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">
                    <h4 class="mb-4 mt-2">{{$t('common.subject.labels.list')}}</h4>
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
        <modal
                name="subject-modal"
                height="auto"
                :draggable="true"
                :classes="['v--modal', 'm-modal']">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <i class="fas fa-times fa-2x btn-modal-close text-success" slot="top-right" @click="$modal.hide('subject-modal')"></i>
                            <h4 class="mt-0">{{$t('common.subject.labels.new')}}</h4>
                            <hr>
                            <form @submit.prevent="$emit('submitAction', item)">
                                <div class="form-group row">
                                    <label class="col-4 col-form-label">{{$t('common.subject.input.title')}} :</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="subject.title">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-simple btn-sm px-3" @click="$modal.hide('subject-modal')">{{$t('common.close')}}</button>
                <button type="button" class="btn btn-primary btn-sm btn-round btn-fill px-4" @click="saveSubject">{{$t('common.buttons.save')}}</button>
            </div>
        </modal>
    </div>
</template>
<script>

  import Vue from 'vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import TableCustomColumn from 'src/components/UIComponents/DataTable/TableCustomColumn';
  import TableActions from 'src/components/UIComponents/DataTable/TableActions';
  import {mapState, mapGetters} from 'vuex'
  import {Subject} from "src/models/definition";

  export default {
    components: {
      Card,
      TableActions,
      TableCustomColumn
    },
    data () {
      return {
        loading: false,
        selectedBanner: null,
        subject : new Subject(),
        mode : 'save',
        datatable: {
          columns: [
            { title: 'ID', field: 'id', sortable: true},
            { title:  this.$t('common.subject.datatable.title'),   field: 'title', tdComp: TableCustomColumn},
            { tdComp: TableActions, visible: 'true', thStyle: { width: '10%' }, tdStyle: { width: '10%' } }
          ],
          data: [],
          total: 0,
          query: {sort: 'id', order: 'asc'},
          selection: this.selection ? [] : null,
          HeaderSettings: false,
          supportNested: true,
          supportBackup: true,
          xprops: {
            eventbus: new Vue()
          }
        },
        bus: new Vue()
      }
    },
    watch: {
      "datatable.query": {
        handler (query) {
          this.getAllSubjects()
        },
        deep: true
      }
    },
    computed: {
      ...mapState('definition', {
        subjects: state => state.subjects
      })
    },
    created(){
      this.datatable.xprops.eventbus.$on('edit', item => {
        this.edit(item)
      });
      this.datatable.xprops.eventbus.$on('delete', item => {
        this.delete(item)
      });
    },
    methods:{
      getAllSubjects(){
        let query = this.datatable.query;
        if(query.sort == 'name') {
          query.sort = `${query.sort}.${this.$store.getters['account/getActiveLanguage'].code}`
        }
        let filter = {
          sort:  query.sort,
          order: query.order,
          limit: query.limit,
          offset:query.offset
        };
        this.loading = true;
        this.$store.dispatch('definition/getAllSubjects', {filter: filter}).then((response) => {
          this.loading = false;
    //      this.datatable.total = response.pagination.recordCount;
          this.datatable.data = response.set;
        })
      },
      edit(item){
        this.mode = 'edit';
        this.subject = item;
        this.$modal.show('subject-modal');
      },
      delete(item) {
        this.$modal.show('dialog', {
          title: 'Warning!!',
          text: `${item.title} will be deleted. Are you sure?`,
          buttons: [
            {
              title: 'Cancel'
            },
            {
              title: 'Yes',
              class: 'btn btn-danger btn-fill',
              handler: () => {
                this.$store.dispatch('definition/deleteSubject', {data: item}).then(() => {
                  this.notify('Subject Deleted.', 'success');
                  this.$modal.hide('dialog');
                  this.getAllSubjects();
                })
              }
            }
          ]
        });
      },
      openModal(mode){

        if(mode === 'save'){
          this.mode = 'save';
          this.subject =  new Subject();
          this.$modal.show('subject-modal');
        }
      },
      saveSubject(){
        if(this.mode === 'save') {
          this.$store.dispatch('definition/createSubject', {data: this.subject}).then((response) => {
            this.getAllSubjects();
            this.$modal.hide('subject-modal');
            this.notify(this.$t(response.message), 'success');
          }).catch(error =>{
            this.notify(this.$t(response.message), 'err');
          });
        }else{
          this.$store.dispatch('definition/updateSubject', {data: this.subject}).then((response) => {
              this.getAllSubjects();
              this.$modal.hide('subject-modal');
              this.notify(this.$t(response.message), 'success');
          }).catch(error =>{
            this.notify(this.$t(response.message), 'err');
          });
        }
      },

    }
  }
</script>
<style>
</style>
