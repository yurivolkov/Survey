<template>
  <div class="action-list">
    <button class="btn btn-success" type="button"  @click.prevent="choices('choices')">
      <i class="fa fa-bar-chart" aria-hidden="true"></i>
    </button>
    <button class="btn btn-success" type="button"  @click.prevent="actionClickHandler('edit')">
      <i class="far fa-edit"></i>
    </button>
    <button class="btn btn-danger" type="button"  @click.prevent="actionClickHandler('delete')">
      <i class="far fa-trash-alt"></i>
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
    mounted(){
      $(this.$el).closest('tr').addClass("selectable").on('click', (event) => {
        this.singleClickHandler(event);
      });

      $(this.$el).closest('tr').addClass("selectable").dblclick((event) => {
        this.dobuleClickHandler(event);
      })
    },
    methods: {
      choices(){
        if (this.nested.comp === SpecialChoiceTable) return this.nested.$toggle();
        this.nested.$toggle(SpecialChoiceTable, true);
      },
      actionClickHandler(key){
        this.xprops.eventbus.$emit(key, this.row)
      },
      singleClickHandler(event){
        this.xprops.eventbus.$emit("singleClick", this.row, event);
      },
      dobuleClickHandler(event){
        this.xprops.eventbus.$emit("doubleClick", this.row, event);
      }
    }
  }
</script>

<style lang="css">
</style>
