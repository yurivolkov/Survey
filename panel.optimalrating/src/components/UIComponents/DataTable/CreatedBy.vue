<template>
  <div>
    {{name}} ({{row.user_id}})
  </div>
</template>
<script>
export default {
  props: ["row"],
  data() {
    return {
      name: "-"
    };
  },
  mounted() {
    this.$store
      .dispatch("definition/getUser", { id: this.row.user_id })
      .then(res => {
        this.name = res.set.email;
        console.log(res);
      });
  }
};
</script>
