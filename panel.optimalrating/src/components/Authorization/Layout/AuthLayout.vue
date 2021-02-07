<template>
  <div class="wrapper">
    <div class="authorization-panel">
      <authorization-content></authorization-content>
    </div>
  </div>
</template>

<script>
  import AuthorizationContent from './Content.vue'
  export default {
    components: {
      AuthorizationContent,
    }
  }
</script>

<style lang="scss">
</style>
