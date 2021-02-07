<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">
                    <h4 class="mb-4 mt-2">{{$t('common.page.labels.list')}}</h4>
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
                name="country-modal"
                height="auto"
                :draggable="true"
                :classes="['v--modal', 'm-modal']">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <i class="fas fa-times fa-2x btn-modal-close text-success" slot="top-right" @click="$modal.hide('country-modal')"></i>
                            <h4 class="mt-0">{{$t('common.page.labels.translation')}}</h4>
                            <hr>
                            <page-form v-if="page" :item="page"></page-form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-simple btn-sm px-3" @click="$modal.hide('country-modal')">{{$t('common.close')}}</button>
                <button type="button" class="btn btn-primary btn-sm btn-round btn-fill px-4" @click="saveTranslation" :disabled="saving">
                  {{ saving ? 'Saving...' : $t('common.buttons.save')}}
                </button>
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
  import CountryPageActions from 'src/components/UIComponents/DataTable/CountryPageActions';
  import PageForm from 'src/components/Dashboard/Views/Page/PageForm';
  import {mapState, mapGetters} from 'vuex'
  import {Page} from "src/models/definition";

  export default {
    components: {
      Card,
      TableCustomColumn,
      ImageField,
      CountryPageActions,
      PageForm,
      TableColumnStatus
    },
    data () {
      return {
        saving: false,
        loading: false,
        selectedBanner: null,
        page : new Page(),
        currentPage:null,
        mode : 'save',
        datatable: {
          columns: [
            { title: 'ID', field: 'id', sortable: true},
            { title:  this.$t('common.page.datatable.title'),   field: 'title', tdComp: TableCustomColumn},
            { title:  this.$t('common.page.datatable.translation'),   field: 'translation.title', tdComp: TableCustomColumn},
            { tdComp: CountryPageActions, visible: 'true', thStyle: { width: '10%' }, tdStyle: { width: '10%' } }
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
      this.datatable.xprops.eventbus.$on('translation', item => {
        this.currentPage = item.id;
        this.page = this._.merge((new Page()),item.translation)
        this.$modal.show('country-modal');
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
      saveTranslation(){
        this.saving = true;
        this.$store.dispatch('definition/translationPage', {id:this.currentPage, data:this.page}).then((response) => {
          this.saving = false;
          if(response.code === 200){
            this.getAllPages();
            this.$modal.hide('country-modal');
            this.notify(this.$t(response.message), 'success');
          }
        }).catch(error =>{
          this.saving = false;
          this.notify(this.$t(response.message), 'err');
        });
      }
    }
  }
</script>
<style>
</style>
