<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <h4 class="mb-4 mt-2 text-danger">{{$t('common.category.components.list')}}</h4>
            </div>
          </div>
          <card  class="col-6 float-left">
                <category-tree
                        :items="categories"
                        :bus="bus">
                </category-tree>
          </card>

          <card class="col-6 float-left">
              <category-detail
                      ref="categoryDetail"
                      :bus="bus"
                      :item="selectedCategory"
                      @save="updateCategories"
                      @delete="updateCategories">
              </category-detail>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import CategoryTree from 'src/components/Dashboard/Views/Category/CategoryTree'
  import CategoryDetail from 'src/components/Dashboard/Views/Category/CategoryDetail'
  import {mapState} from 'vuex'

  export default {
    components: {
      Card,
      CategoryTree,
      CategoryDetail
    },
    data(){
      return {
        bus: new Vue(),
        selectedCategory: null,
      }
    },
    computed:{
      ...mapState('definition', {
        categories: state => state.categories
      })
    },
    mounted() {
      console.log("mount")
    },
    created() {
      this.bus.$on('select', item => {
        this.selectedCategory = this._.cloneDeep(item);
        this.$refs.categoryDetail.category = this._.cloneDeep(item);
      });
      this.bus.$on('update-list', item => {
        this.getCategories(0);
      });
      this.getCategories(0);
    },
    methods:{
      getCategories(parentId){
        this.loading = true;
        this.$store.dispatch('definition/getAllCategoryTree', {filter: {sort: ['+listOrder']}}).then(() => {
          this.loading = false;
        }).catch(() =>{
          this.loading = false;
        });
      },
      updateCategories(){
        this.loading = true;
        this.$store.dispatch('definition/getAllCategoryTree', {filter: {sort: ['+listOrder']}}).then(() => {
          this.loading = false;
        }).catch(() =>{
          this.loading = false;
        });
      },
    }
  }
</script>

<style lang="css">
</style>
