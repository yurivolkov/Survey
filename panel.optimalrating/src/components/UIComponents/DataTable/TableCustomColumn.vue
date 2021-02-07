<template>
  <div class="disapproved" v-if="row['status'] ==='pendingApproved'">{{byString(row, field)}}</div>
  <div v-else>{{byString(row, field)}}</div>
</template>
<script>
  export default {
    props: ['row', 'field'],
    methods: {
      byString (o, s) {
          if(s && o) {
              s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
              s = s.replace(/^\./, '');           // strip a leading dot
              var a = s.split('.');
              for (var i = 0, n = a.length; i < n; ++i) {
                  var k = a[i];
                  if (o && typeof o === 'object' && k in o) {
                      o = o[k];
                  } else {
                      return null;
                  }
              }
              return o;
          }
          else {
              return null;
          }
      }
    }
  }
</script>
<style>
  .disapproved {
    color:red;
  }
</style>
