<template>
  <div class="banner-images">
    <img :src="imageUrl+'images/banner/'+row.image">
  </div>
</template>

<script>
	export default {
		props: ['row', 'field', 'xprops'],
		data(){
			return {
				imageUrl : process.env.CDN_LOCATION,
			}
		}
	}
</script>

<style lang="css">
  .banner-images{
    width: 25%;
  }
  .banner-images img{
    width: 100%;
  }
</style>
