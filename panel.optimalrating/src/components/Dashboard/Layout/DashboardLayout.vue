<template>
  <div class="wrapper">

    <side-bar>
      <sidebar-link v-for="menuItem in menu" :to="menuItem.route">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>{{menuItem.text}}</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
    <v-dialog/>
  </div>
</template>

<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import axios from 'axios'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
    },
    data(){
      return {
        menu : []
      }
    },
    created(){
      this.getMenu();
    },
    mounted() {
      $('.collapse').collapse();
    },
    methods: {
      getMenu(){

        let token = localStorage.getItem('token');

        if (token === undefined || token === null)
          return [];

        let apiUrl = process.env.API_LOCATION;


        return new Promise((resolve,reject) => {
          return axios.get(apiUrl+ 'menu',
                  {
                    headers : {
                      Authorization : 'Bearer '+token
                    }
                  })
                  .then((response) =>{
                    this.menu = response.data;
                  });
        })
      },
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
