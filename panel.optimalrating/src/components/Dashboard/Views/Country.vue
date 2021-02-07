<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">
                    <h4 class="mb-4 mt-2">{{$t('common.country.labels.list')}}</h4>
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
                name="country-modal"
                height="auto"
                :draggable="true"
                :classes="['v--modal', 'm-modal']">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <i class="fas fa-times fa-2x btn-modal-close text-success" slot="top-right" @click="$modal.hide('country-modal')"></i>
                            <h4 class="mt-0">{{$t('common.country.labels.new')}}</h4>
                            <hr>
                            <country-form :item="country" :mode="mode"></country-form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-simple btn-sm px-3" @click="$modal.hide('country-modal')">{{$t('common.close')}}</button>
                <button type="button" class="btn btn-primary btn-sm btn-round btn-fill px-4" @click="saveCountry">{{$t('common.buttons.save')}}</button>
            </div>
        </modal>
    </div>
</template>
<script>

  import Vue from 'vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import TableCustomColumn from 'src/components/UIComponents/DataTable/TableCustomColumn';
  import TableColumnStatus from 'src/components/UIComponents/DataTable/TableColumnStatus';
  import CountryTableActions from 'src/components/Dashboard/Views/Country/CountryTableActions';
  import ImageField from 'src/components/Dashboard/Views/Country/ImageField';
  import TableActions from 'src/components/UIComponents/DataTable/TableActions';
  import CountryForm from 'src/components/Dashboard/Views/Country/CountryForm';
  import {mapState, mapGetters} from 'vuex'
  import {Country} from "src/models/definition";

  export default {
    components: {
      Card,
      TableCustomColumn,
      ImageField,
      TableActions,
      CountryForm,
      TableColumnStatus
    },
    data () {
      return {
        loading: false,
        selectedBanner: null,
        country : new Country(),
        mode : 'save',
        datatable: {
          columns: [
            { title: 'ID', field: 'id', sortable: true},
            { title:  this.$t('common.country.datatable.name'),   field: 'name', tdComp: TableCustomColumn},
            { title:  this.$t('common.country.datatable.code'),   field: 'code', tdComp: TableCustomColumn},
            { title:  this.$t('common.country.datatable.flag'),   field: 'flag', tdComp: ImageField},
            { title:  this.$t('common.country.datatable.order'),  field: 'sort_order', tdComp: TableCustomColumn},
            { title:  this.$t('common.country.datatable.status'), field: 'status', tdComp: TableColumnStatus},
            { tdComp: CountryTableActions, visible: 'true', thStyle: { width: '10%' }, tdStyle: { width: '10%' } }
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
          this.getAllCountries()
        },
        deep: true
      }
    },
    computed: {
      ...mapState('definition', {
        _countries: state => state.countries
      }),
      "countries": function(){
        return this._.cloneDeep(this._countries);
      },
    },
    created(){
      this.datatable.xprops.eventbus.$on('edit', item => {
        this.edit(item)
      });
      this.datatable.xprops.eventbus.$on('delete', item => {
        this.delete(item)
      });
      this.datatable.xprops.eventbus.$on('city-list', item => {
        this.cityList(item)
      });
    },
    methods:{
      getAllCountries(){
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
        this.$store.dispatch('definition/getAllCountries', {filter: filter}).then((response) => {
          this.loading = false;
          this.datatable.total = response.pagination && response.pagination.recordCount ? response.pagination.recordCount : 1;
          this.datatable.data = this.countries;
        })
      },
      edit(item){
        this.mode = 'edit';
         this.country = item;
        this.$modal.show('country-modal');
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
                this.$store.dispatch('definition/deleteCountry', {data: item}).then(() => {
                  this.notify('Country Deleted.', 'success');
                  this.$modal.hide('dialog');
                  this.getAllCountries();
                })
              }
            }
          ]
        });
      },
      openModal(mode){

        if(mode === 'save'){
          this.mode = 'save';
          this.country =  new Country();
          this.$modal.show('country-modal');
        }
      },
      saveCountry(){
        if(this.mode === 'save') {
          this.$store.dispatch('definition/createCountry', {data: this.country}).then((response) => {
            this.getAllCountries();
            this.$modal.hide('country-modal');
            this.notify(this.$t(response.message), 'success');
          }).catch(error =>{
            console.warn(error);
            this.notify(this.$t(response.message), 'err');
          });
        }else{
          this.$store.dispatch('definition/updateCountry', {data: this.country}).then((response) => {
            if(response.code === 200){
              this.getAllCountries();
              this.$modal.hide('country-modal');
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
