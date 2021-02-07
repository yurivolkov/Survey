<template>
    <div>
        {{format(row.start_at)}}
    </div>
</template>
<script>
    export default {
      props: ['row'],
      methods:{
        format(date) {
          return date.split(' ')[0];
        },
        getMonth(date){
          let options = { month: 'long'};
          let month = new Date(date);
          return new Intl.DateTimeFormat('en-US', options).format(month);
        }
      }
    }
</script>
