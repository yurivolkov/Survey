<template>
  <div>
    <toggle-button
      color="#82C7EB"
      :sync="true"
      :height="20"
      :width="40"
      :value="selectedStatus"
      @change="changeStatus"
    />
  </div>
</template>

<script>
export default {
  props: ["row", "field", "xprops"],
  data() {
    return {
      selectedStatus: this.row.status === "1"
    };
  },
  methods: {
    changeStatus(status) {
      if (status.value == true) {
        this.$modal.show("dialog", {
          title: "Warning!!",
          text: `Are you sure?`,
          buttons: [
            {
              title: "Cancel",
              handler: () => {
                this.$modal.hide("dialog");
              }
            },
            {
              title: "Yes",
              class: "btn btn-danger btn-fill",
              handler: () => {
                this.xprops.eventbus.$emit("status", {
                  id: this.row.id,
                  status: "1"
                });
                this.selectedStatus = true;
                this.$modal.hide("dialog");
              }
            }
          ]
        });
      } else {
        this.$modal.show("dialog", {
          title: "Warning!!",
          text: `Are you sure?`,
          buttons: [
            {
              title: "Cancel",
              handler: () => {
                this.$modal.hide("dialog");
              }
            },
            {
              title: "Yes",
              class: "btn btn-danger btn-fill",
              handler: () => {
                this.xprops.eventbus.$emit("status", {
                  id: this.row.id,
                  status: "0"
                });
                this.selectedStatus = false;
                this.$modal.hide("dialog");
              }
            }
          ]
        });
      }
    }
  }
};
</script>

<style lang="css">
</style>
