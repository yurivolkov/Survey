<template>
  <div class="action-list">
    <button class="btn btn-success" type="button"  @click.prevent="actionClickHandler('detail')">
      <i class="fa fa-search"></i>
    </button>
  </div>
</template>

<script>
  export default {
    props: ['row', 'xprops', 'nested'],
    methods: {
      actionClickHandler(key){
        this.xprops.eventbus.$emit(key, this.row)
      },
      changeStatus(status){
        this.xprops.eventbus.$emit('detail', {'item':this.row.id, 'status': status.value == true ? 'a' : 'i' });
      }
    }
  }
</script>
