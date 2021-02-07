<template>
  <div class="action-list">
    <button class="btn btn-success" type="button"  @click.prevent="actionClickHandler(row.status)">
      {{ this.row.status=='active' ? 'Reject' : 'Approve' }} ({{ this.row.status }})
    </button>
  </div>
</template>

<script>

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
                if(key == 'active')
                this.row.status= 'passive'
                else
                this.row.status= 'active'
				this.xprops.eventbus.$emit('changeStatus', this.row)
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
