<template>
  <div>
    <span :class="['badge', 'badge-pill', row[field] === 'active' || row[field] === 1 ? 'badge-success' : 'badge-secondary']"
          v-if="field === 'status'">{{row[field] === 'active' || row[field] === 1 ? $t('common.labels.active') : $t('common.labels.passive')}}</span>
    <span v-if="is_new" class="badge badge-pill badge-warning">NEW</span>

  </div>
</template>

<script>

export default {
  props: ['row', 'field'],
  computed: {
    'is_new': function(){
      if(this.field == 'isNew') {
        return this.row['is_new'] == 'y' ? true : false;
      }
      else {
        return null;
      }

    }
  }
}
</script>

<style lang="css">
</style>
