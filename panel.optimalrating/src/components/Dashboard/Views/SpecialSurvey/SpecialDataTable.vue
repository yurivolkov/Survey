<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h4 class="mb-4 mt-2">{{title}}</h4>
            </div>
            <div class="col-12">
                <div class="row">
                    <div class="col-12">
                        <card>
                            <div class="query-form">
                                <div class="form-inline col-md-12 float-left">
                                    <div class="form-inline col-md-6 float-left">
                                        <label class="col-3" for="year">Year</label>

                                        <treeselect class="col-8"
                                                    id="year"
                                                    v-model="yearSelected"
                                                    :options="years"
                                                    placeholder="Year"
                                                    valueFormat="id"
                                        />
                                    </div>
                                    <div class="form-inline col-md-6 float-left">
                                        <label class="col-3" for="month">Month</label>
                                        <treeselect  class="col-8"
                                                    id="month"
                                                    v-model="monthSelected"
                                                    :options="months[0]"
                                                    placeholder="Month"
                                                    valueFormat="id"
                                        />
                                    </div>
                                </div>
                            </div>
                        </card>
                    </div>
                </div>
            </div>
            <div class="col-12">
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
    data(){
      return {
        years: [{id:'2019', label:'2019'},{id:'2020', label:'2020'}],
        months: [],
        month: null,
        yearSelected: null,
        monthSelected: null,
        monthsArray : ['January','February','March','April','May','June','July','August','September','October','November','December'],

      }
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
    },
    created(){
      this.months.push(this._.map(this.monthsArray, (month, index)=>{
        return {
          id: index + 1,
          label: month
        }
      }));
    },
    methods: {
      openModal(modal){
        this.datatable.xprops.eventbus.$emit('openModal');
      }
    }
  }
</script>
