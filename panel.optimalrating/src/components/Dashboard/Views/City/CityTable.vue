<template>
    <div class="shopping-bag-detail">
        <div class="loader" v-if="loading"></div>

        <div class="clearfix"></div>
        <div class="row">
            <div class="col-8">
                <h4 class="mb-4 mt-2">{{$t('common.city.labels.list')}}</h4>
            </div>
            <div class="col-4">
                <button type="button" name="button" class="btn btn-sm btn-fill btn-round btn-primary float-right mb-2 mt-2" @click="openModal('save')"><i class="fas fa-plus"></i> {{$t('common.buttons.new')}}</button>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <datatable :class="{'loading-table': loading}" v-if="datatable.data" v-bind="datatable" />
            </div>
        </div>

        <modal
                name="city-modal"
                height="auto"
                :draggable="true"
                :classes="['v--modal', 'm-modal']">
            <div class="modal-body">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <i class="fas fa-times fa-2x btn-modal-close text-success" slot="top-right" @click="$modal.hide('city-modal')"></i>
                            <h4 class="mt-0">{{$t('common.city.labels.new')}}</h4>
                            <hr>
                            <form @submit.prevent="$emit('submitAction', item)">

                                <div class="form-group row">
                                    <label class="col-4 col-form-label">{{$t('common.category.input.name')}} :</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="city.name" >
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-4 col-form-label">{{$t('common.city.input.order')}} :</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="city.order" >
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-simple btn-sm px-3" @click="$modal.hide('country-modal')">{{$t('common.close')}}</button>
                <button type="button" class="btn btn-primary btn-sm btn-round btn-fill px-4" @click="saveCity">{{$t('common.buttons.save')}}</button>
            </div>
        </modal>
    </div>
</template>

<script>
  import Vue from 'vue'
  import TableActions from 'src/components/UIComponents/DataTable/TableActions';
  import TableCustomColumn from 'src/components/UIComponents/DataTable/TableCustomColumn';
  import TableColumnStatus from 'src/components/UIComponents/DataTable/TableColumnStatus';
  import {mapState, mapGetters} from 'vuex'
  import {City} from "src/models/definition";

  export default {
    components: {
      TableCustomColumn,
      TableActions,
      TableColumnStatus
    },
    props: ['row', 'xprops', 'nested'],
    data(){
      return{
        loading: false,
        city : new City,
        datatable: {
          columns: [
            { title: 'ID', field: 'id', sortable: true},
            { title:  this.$t('common.city.datatable.name'),   field: 'name', tdComp: TableCustomColumn},
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
      }
    },
    watch: {
      "datatable.query": {
        handler (query) {
         this.getAllCities();
        },
        deep: true
      }
    },

    created(){
      this.city.country_id = this.row.id;
      this.datatable.xprops.eventbus.$on('edit', item => {
        this.edit(item)
      });
      this.datatable.xprops.eventbus.$on('delete', item => {
        this.delete(item)
      });
    },

    computed:{
      ...mapState('definition', {
        _cities: state => state.cities
      }),
      "cities": function(){
        return this._.cloneDeep(this._cities);
      },
    },
    methods:{

      edit(item){
        this.mode = 'edit';
        this.city = item;
        this.$modal.show('city-modal');
      },

      openModal(mode){

        if(mode === 'save'){
          this.mode = 'save';
          this.country =  new City();
          this.$modal.show('city-modal');
        }
      },

      saveCity(){
        if(this.mode === 'save') {
          
          this.$store.dispatch('definition/createCity', {data: this.city}).then((response) => {
            this.getAllCities();
            this.$modal.hide('city-modal');
            this.notify(this.$t(response.message), 'success');
          }).catch(error =>{
            this.notify(this.$t(response.message), 'err');
          });
        }else{
          this.$store.dispatch('definition/updateCity', {data: this.city}).then((response) => {

            if(response.code === 200){
              this.getAllCities();
              this.$modal.hide('city-modal');
              this.notify(this.$t(response.message), 'success');
            }
          }).catch(error =>{
            //this.notify(this.$t(response.message), 'err');
          });
        }
      },
      delete(item) {
        this.$modal.show('dialog', {
          title: 'Warning!!',
          text: `${this.city.name} will be deleted. Are you sure?`,
          buttons: [
            {
              title: 'Cancel'
            },
            {
              title: 'Yes',
              class: 'btn btn-danger btn-fill',
              handler: () => {
                this.$store.dispatch('definition/deleteCity', {data: item}).then(() => {
                  this.notify('City Deleted.', 'success');
                  this.$modal.hide('dialog');
                  this.getAllCities();
                })
              }
            }
          ]
        });
      },
      getAllCities(){
        
        let query = this.datatable.query;
        if(query.sort == 'name') {
          query.sort = `${query.sort}.${this.$store.getters['account/getActiveLanguage'].code}`
        }
        let filter = {
          sort:  query.sort,
          order: query.order,
          limit: query.limit === undefined ? 10 : query.limit,
          offset:query.offset === undefined ? 0: query.offset,
          id: this.row.id
        };

        this.loading = true;

        this.$store.dispatch('definition/getAllCities', {filter: filter}).then((response) => {
          this.loading = false;
//          this.datatable.total = response.recordCount;
          this.datatable.data = this.cities;
        })
      }
    }
  }
</script>
