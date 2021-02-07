<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h4 :class="`mb-4 mt-2 ${hideFilter ? 'text-danger' : ''}`">{{title}}</h4>
            </div>
        </div>
            
        <card v-if="!hideFilter">   
            <div class="row">
                <div class="form-inline col-md-6 float-left">
                    <label class="col-3" for="categoryOption">Categories</label>
                    <treeselect  class="col-8"
                                id="categoryOption"
                                v-model="categorySelected"
                                :options="categories"
                                placeholder="Choose a category"
                                valueFormat="id"
                    />
                </div>
                <div class="form-inline col-md-2 float-left">
                    <label class="col-3" for="year">Year</label>
                    <treeselect class="col-8"
                                id="year"
                                v-model="yearSelected"
                                :options="years"
                                placeholder="Year"
                                valueFormat="id"
                    />
                </div>
                <div class="form-inline col-md-2 float-left">
                    <label class="col-3" for="month">Month</label>
                    <treeselect  class="col-9"
                                id="month"
                                v-model="monthSelected"
                                :options="months[0]"
                                placeholder="Month"
                                valueFormat="id"
                    />
                </div>
                
                <!-- <div class="form-inline col-md-2">
                    <label class="col-3" for="statusOption">Status</label>
                    <treeselect  class="col-8"
                                id="statusOption"
                                v-model="statusSelected"
                                :options="statuses"
                                placeholder="Status"
                                valueFormat="id"
                    />
                </div> -->
            </div>          
        </card>        
        
        <div class="row">
            <div class="col-12">
                  <card>
                      <datatable :class="{'loading-table': loading}" v-if="datatable.data" v-bind="datatable" />
                  </card>
            </div>
        </div>
    </div>
</template>

<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import {mapState} from 'vuex'
  export default {

    props:['title', 'loading', 'datatable', 'hideFilter'],
    components:{
      Card
    },
    data(){
      return {
        years: [{id:'2019', label:'2019'},{id:'2020', label:'2020'}],
        months: [],
        statuses: [{id:1, label:'active'},{id:0, label:'pending'}],
        month: null,
        yearSelected: null,
        monthSelected: null,
        statusSelected: null,
        monthsArray : ['January','February','March','April','May','June','July','August','September','October','November','December'],
        categorySelected: null,
        categories: []
      }
    },
    computed: {
      ...mapState('definition', {
        _categories: state => state.categories
      })
    },
    watch: {
      "yearSelected" : function (val) {
        if (typeof val == 'undefined' || null === val) {
          // console.log(val)
        }
        else {
          this.datatable.xprops.eventbus.$emit('yearSelected', val);
        }
      },
      "monthSelected" : function (val) {
        if (typeof val == 'undefined' || null === val) {
        }
        else {
          this.datatable.xprops.eventbus.$emit('monthSelected', val);
        }
      },
      "statusSelected" : function (val) {
        if (typeof val == 'undefined' || null === val) {
        }
        else {
          this.datatable.xprops.eventbus.$emit('statusSelected', val);
        }
      },
      "categorySelected" : function (val) {
        if (typeof val == 'undefined' || null === val) {
        }
        else {
          this.datatable.xprops.eventbus.$emit('categorySelected', val);
        }
      },
    },
    created(){
      this.months.push(this._.map(this.monthsArray, (month, index)=>{
        return {
          id: index + 1,
          label: month
        }
      }));
      this._categories.map( (category) => {
          this.categories.push({
            id: category.id,
            label: category.name
          })
      });
    },
    methods: {
      openModal(modal){
        this.datatable.xprops.eventbus.$emit('openModal');
      }
    }
  }
</script>
