<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">
                    <h4 class="mb-4 mt-2">{{$t('common.comments.labels.list')}}</h4>
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
    </div>
</template>
<script>

  import Vue from 'vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import TableCustomColumn from 'src/components/UIComponents/DataTable/TableCustomColumn';
  import TrashAction from 'src/components/UIComponents/DataTable/TrashActions';
  import {mapState, mapGetters} from 'vuex'
  import {Comment} from "src/models/definition";

  export default {
    components: {
      Card,
      TrashAction,
      TableCustomColumn
    },
    data () {
      return {
        loading: false,
        selectedBanner: null,
        comment : new Comment(),
        mode : 'save',
        datatable: {
          columns: [
            { title: 'ID', field: 'id', sortable: true},
            { title:  this.$t('common.comments.datatable.user'),   field: 'user.email', tdComp: TableCustomColumn},
            { title:  this.$t('common.comments.datatable.comment'),  field: 'body', tdComp: TableCustomColumn},
            { tdComp: TrashAction, visible: 'true', thStyle: { width: '10%' }, tdStyle: { width: '10%' } }
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
          this.getAllComments()
        },
        deep: true
      }
    },
    computed: {
      ...mapState('definition', {
        comments: state => state.comments
      })
    },
    created(){
      this.datatable.xprops.eventbus.$on('edit', item => {
        this.edit(item)
      });
      this.datatable.xprops.eventbus.$on('delete', item => {
        this.delete(item)
      });
      this.datatable.xprops.eventbus.$on('changeStatus', item => {
        this.changeStatus(item)
      });
    },
    methods:{
      getAllComments(){
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
        this.$store.dispatch('definition/getAllComments', {filter: filter}).then((response) => {
          this.loading = false;
          this.datatable.total = response.pagination && response.pagination.recordCount ? response.pagination.recordCount : 1;
          this.datatable.data = response.set;
        })
      },
      delete(item) {
        this.$modal.show('dialog', {
          title: 'Warning!!',
          text: `${item.id} will be deleted. Are you sure?`,
          buttons: [
            {
              title: 'Cancel'
            },
            {
              title: 'Yes',
              class: 'btn btn-danger btn-fill',
              handler: () => {
                this.$store.dispatch('definition/deleteComment', {data: item}).then(() => {
                  this.notify('Comments Deleted.', 'success');
                  this.$modal.hide('dialog');
                  this.getAllComments();
                })
              }
            }
          ]
        });
      }
    }
  }
</script>
<style>
</style>
