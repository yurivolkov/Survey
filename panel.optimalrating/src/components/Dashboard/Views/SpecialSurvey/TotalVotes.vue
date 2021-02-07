<template>
  <div class="text-center col-2">
    {{calculateVote()}}
  </div>
</template>

<script>
  export default {
    props: ['row', 'xprops', 'nested'],
    methods: {
      calculateVote(){
        let vote = 0;
        vote = this._.reduce(this.row.votes, (acc, item)=>{
          acc = acc + 1;
          return acc;
        }, 0);
        return vote;
      },
    }
  }
</script>

<style lang="css">
</style>
