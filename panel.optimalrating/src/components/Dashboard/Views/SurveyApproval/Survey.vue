<template>
  <div class="Survey">
    <div style="display :flex">
      <div>{{data.title}}</div>
      <div style="margin-left: auto">
        <i class="fa fa-pencil-square-o" />
        <i class="fa fa-trash" />
        <toggle-button
          color="#82C7EB"
          :sync="true"
          :height="20"
          :width="40"
          :value="data.status === '1'"
          @change="changeStatus"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Survey",
  props: ["data"],
  data() {
    return {
      editData: {}
    };
  },
  methods: {
    changeStatus(val) {
      this.$store
        .dispatch("definition/updateSurveyStatus", {
          id: this.data.id,
          status: val ? "1" : "0"
        })
        .then(() => {
          this.data.status = val ? "1" : "0";
          this.editData.status = val ? "1" : "0";
        });
    }
  }
};
</script>