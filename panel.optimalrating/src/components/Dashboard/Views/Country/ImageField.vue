<template>
  <div class="banner-images">
    <img :src="imageUrl+'images/country/'+row.flag" width="50">
  </div>
</template>

<script>
	export default {
		props: ['row', 'field', 'xprops'],
		data(){
			return {
				imageUrl : 'http://server.optimalrating.com/cdn/',
			}
		}
	}
</script>

