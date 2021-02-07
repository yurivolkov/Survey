<template>
  <div>
    <input class="form-control" type="text" v-model="row[field]">
  </div>
</template>
<script>
  export default {
    props: ['row', 'field']
  }
</script>
