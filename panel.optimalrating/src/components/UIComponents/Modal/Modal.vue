<template>
  <div class="modal fade" tabindex="-1" role="dialog" :id="id">
    <div class="modal-dialog" :class="cssClass" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="title"></slot>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-fill" @click.prevent="priBtnAction">{{$t('common.save')}}</button>
          <button type="button" class="btn btn-secondary" @click.prevent="secBtnAction" data-dismiss="modal">{{$t('common.close')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal',
  props: ['id', 'cssClass'],
  methods: {
    priBtnAction(){
      this.$emit('priBtnAction')
    },
    secBtnAction(){
      this.$emit('secBtnAction')
    }
  }
}
</script>
<style lang="css">
</style>
