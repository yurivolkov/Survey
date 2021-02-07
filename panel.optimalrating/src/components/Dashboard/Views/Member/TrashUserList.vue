<template>
    <div>
        <div class="row" v-if="datatableTrash.data.length > 0 && roles && roles !== 'country_admin'">
            <div class="col-12">
                <div class="row">
                    <div class="col-8">
                        <h4 class="mb-4 mt-2">Trash User List</h4>
                    </div>
                    <div class="col-12">
                        <card>
                            <datatable :class="{'loading-table': loading}" v-if="datatableTrash.data" v-bind="datatableTrash" />
                        </card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import TableTrashActions from 'src/components/Dashboard/Views/Member/TableTrashActions.vue';
  import TableCustomColumn from 'src/components/UIComponents/DataTable/TableCustomColumn';
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  export default {
    components: {
      Card,
      TableTrashActions,
    },
    props: ['roles','trashData'],
    data() {
      return {
        datatableTrash: {
          columns: [
            {title: 'Name', field: 'firstname', tdComp: TableCustomColumn},
            {title: 'Surname', field: 'lastname', tdComp: TableCustomColumn},
            {title: 'Gender', field: 'user_details.gender', tdComp: TableCustomColumn},
            {title: 'Birthdate', field: 'user_details.birthdate', tdComp: TableCustomColumn},
            {title: 'city', field: 'country.name', tdComp: TableCustomColumn},
            {title: 'status', field: 'status', tdComp: TableCustomColumn},
            {tdComp: TableTrashActions, visible: 'true', thStyle: {width: '10%'}, tdStyle: {width: '10%'}},
          ],
          pagination: false,
          data: [],
          total: 0,
          query: {sort: 'id', order: 'asc', keyword: null, country: null, city: null},
          selection: this.selection ? [] : null,
          HeaderSettings: false,
          supportNested: true,
          supportBackup: true,
          xprops: {
            eventbus: new Vue(),
          },
        },
      };
    },
    watch:{
      "trashData": (item)=>{
        this.datatableTrash.data = item
      }
    },
    created() {
      this.datatableTrash.xprops.eventbus.$on('undoUser', item => {
        this.trashUser(item,'approved')
      });
      this.datatableTrash.data = this.trashData
    },
    methods: {
      async trashUser(item, status){
        this.mode = 'edit';
        item.status = status;
        this.user = item;
        await this.saveUser();
      },
      saveUser(){
        if(this.mode === 'save') {
          this.$store.dispatch('definition/saveUser', {data: this.user}).then((response) => {
            this.$modal.hide('user-modal');
            this.$modal.hide('status-modal');
            this.notify(this.$t(response.message), 'success');
          })
        }else{
          this.$store.dispatch('definition/updateUser', {data: this.user}).then((response) => {
            if(response.code === 200){
              this.$modal.hide('user-modal');
              this.$modal.hide('status-modal');
              this.notify(this.$t(response.message), 'success');
            }
          })
        }
      },
    }
  };
</script>
