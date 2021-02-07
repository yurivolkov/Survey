<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <!--<waiting-categories :bus="bus" :categories="categories"/>-->
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import WaitingCategories from 'src/components/Dashboard/Views/Dashboard/WaitingCategories';
  export default {
    components:{
      WaitingCategories
    },
    data(){
      return{
        bus: new Vue(),
        categories: []
      }
    }
  }
</script>
