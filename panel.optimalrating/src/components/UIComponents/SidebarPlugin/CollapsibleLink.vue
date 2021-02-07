<template>
  <li>
    <button data-toggle="collapse" :data-target="'#' + collapse.id" aria-expanded="false" :aria-controls="collapse.id">
      <i class="nc-icon" :class="collapse.icon"></i>
      <p>{{collapse.name}}</p>
      <i class="caret nc-icon nc-stre-down"></i>
    </button>
    <ul :id="collapse.id" class="collapse">
      <slot>
        <sidebar-link v-for="(link,index) in sidebarLinks"
                      :key="link.name + index"
                      :to="link.path"
                      @click="closeNavbar"
                      :link="link">
          <i :class="link.icon"></i>
          <p>{{link.name}}</p>
        </sidebar-link>
      </slot>
    </ul>
  </li>
</template>
<script>
  export default {
    props: {
      collapse: {
          type: [String, Object] ,
          default: () => {
            return {
              id: '',
              name: ''
            }
          }
      },
      id: {
          type: String,
          default: null
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      collapse: {

      },
      link: {
        type: [String, Object],
        default: () => {
          return {
            name: '',
            path: '',
            icon: ''
          }
        }
      }
    },
    methods: {

    }
  }
</script>
<style>
</style>
