<template>
  <div class="action-list">
    <button class="btn btn-success" type="button"  @click.prevent="actionClickHandler('edit')">
      <i class="far fa-edit"></i>
    </button>
    <button class="btn btn-danger" type="button"  @click.prevent="actionClickHandler('delete')">
      <i class="far fa-trash-alt"></i>
    </button>

    <button class="btn btn-dark" type="button"  @click.prevent="openCityTable">
      <i class="far fa-building"></i>
    </button>
  </div>
</template>

<script>
  import CityTable from 'src/components/Dashboard/Views/City/CityTable';

  export default {

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
      actionClickHandler(key){
        this.xprops.eventbus.$emit(key, this.row)
      },
      singleClickHandler(event){
        this.xprops.eventbus.$emit("singleClick", this.row, event);
      },
      dobuleClickHandler(event){
        this.xprops.eventbus.$emit("doubleClick", this.row, event);
      },
      openCityTable(){
        if (this.nested.comp === CityTable) return this.nested.$toggle();
        this.nested.$toggle(CityTable, true);
      },
    }
  }
</script>

<style lang="css">
</style>
