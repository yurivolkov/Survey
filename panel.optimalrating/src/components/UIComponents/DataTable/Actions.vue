<template>
  <div class="action-list">
    <div class="dropdown">
      <button class="btn " type="button" data-toggle="dropdown">
        <i class="fas fa-angle-down"></i>
      </button>
      <ul class="dropdown-menu dropdown-menu-right">
        <li class="dropdown-item" @click.prevent="actionClickHandler('edit')">Değiştir</li>
        <li class="dropdown-item" @click.prevent="actionClickHandler('delete')">Sil</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['row', 'xprops'],
  mounted(){
    $(this.$el).closest('tr').addClass("selectable").on('click', (event) => {
      this.singleClickHandler(event);
    })

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
    }
  }
}
</script>

<style lang="css">
</style>
