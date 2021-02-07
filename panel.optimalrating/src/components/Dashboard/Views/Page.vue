<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">
                    <h4 class="mb-4 mt-2">{{$t('common.page.labels.list')}}</h4>
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
                name="page-modal"
                height="auto"
                :draggable="true"
                :classes="['v--modal', 'm-modal']">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <i class="fas fa-times fa-2x btn-modal-close text-success" slot="top-right" @click="$modal.hide('page-modal')"></i>
                            <h4 class="mt-0">{{$t('common.page.labels.new')}}</h4>
                            <hr>
                            <page-form :item="page" :mode="mode"></page-form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-simple btn-sm px-3" @click="$modal.hide('page-modal')">{{$t('common.close')}}</button>
                <button type="button" class="btn btn-primary btn-sm btn-round btn-fill px-4" @click="savePage">{{$t('common.buttons.save')}}</button>
            </div>
        </modal>
    </div>
</template>
<script>

  import Vue from 'vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import TableCustomColumn from 'src/components/UIComponents/DataTable/TableCustomColumn';
  import TableColumnStatus from 'src/components/UIComponents/DataTable/TableColumnStatus';
  import ImageField from 'src/components/Dashboard/Views/Country/ImageField';
  import TableActions from 'src/components/UIComponents/DataTable/TableActions';
  import PageForm from 'src/components/Dashboard/Views/Page/PageForm';
  import {mapState, mapGetters} from 'vuex'
  import {Page} from "src/models/definition";

  export default {
    components: {
      Card,
      TableCustomColumn,
      ImageField,
      TableActions,
      PageForm,
      TableColumnStatus
    },
    data () {
      return {
        loading: false,
        selectedBanner: null,
        page : new Page(),
        mode : 'save',
        datatable: {
          columns: [
            { title: 'ID', field: 'id', sortable: true},
            { title:  this.$t('common.page.datatable.title'),   field: 'title', tdComp: TableCustomColumn},
            { title:  this.$t('common.page.datatable.order'),   field: 'order', tdComp: TableCustomColumn},
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
          this.getAllPages()
        },
        deep: true
      }
    },
    computed: {
      ...mapState('definition', {
        _pages: state => state.pages
      }),
      "pages": function(){
        return this._.cloneDeep(this._pages);
      },
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
      getAllPages(){
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
        this.$store.dispatch('definition/getAllPages', {filter: filter}).then((response) => {
          this.loading = false;
          this.datatable.total = response.pagination && response.pagination.recordCount ? response.pagination.recordCount : 1;
          this.datatable.data = this.pages;
        })
      },
      edit(item){
        this.mode = 'edit';
        this.page = item;
        this.$modal.show('page-modal');
      },
      delete(item) {
        this.$modal.show('dialog', {
          title: 'Warning!!',
          text: `${item.name} will be deleted. Are you sure?`,
          buttons: [
            {
              title: 'Cancel'
            },
            {
              title: 'Yes',
              class: 'btn btn-danger btn-fill',
              handler: () => {
                this.$store.dispatch('definition/deletePage', {data: item}).then(() => {
                  this.notify('Page Deleted.', 'success');
                  this.$modal.hide('dialog');
                  this.getAllPages();
                })
              }
            }
          ]
        });
      },
      openModal(mode){
        if(mode === 'save'){
          this.mode = 'save';
          this.page =  new Page();
          this.$modal.show('page-modal');
        }
      },
      savePage(){
        if(this.mode === 'save') {
          this.$store.dispatch('definition/createPage', {data: this.page}).then((response) => {
            this.getAllPages();
            this.$modal.hide('page-modal');
            this.notify(this.$t(response.message), 'success');
          }).catch(error =>{
            console.warn(error);
            this.notify(this.$t(response.message), 'err');
          });
        }else{
          this.$store.dispatch('definition/updatePage', {id:this.page.id, data:this.page}).then((response) => {
            if(response.code === 200){
              this.getAllPages();
              this.$modal.hide('page-modal');
              this.notify(this.$t(response.message), 'success');
            }
          }).catch(error =>{
            console.warn(error);
            this.notify(this.$t(response.message), 'err');
          });
        }
      },
    }
  }
</script>
<style>
</style>
