<template>
  <div class="action-list">
    <button class="btn btn-success" type="button"  @click.prevent="fake('fake')">
      <i class="fa fa-thumbs-up"></i>
    </button>
  </div>
</template>

<script>
  import SpecialChoiceTable from 'src/components/Dashboard/Views/SpecialSurvey/SpecialChoiceTable';
  export default {
    components:{
      SpecialChoiceTable
    },
    props: ['row', 'xprops', 'nested'],

    methods: {
      fake(key){
        this.xprops.eventbus.$emit(key, this.row)
      }
    }
  }
</script>

<style lang="css">
</style>
