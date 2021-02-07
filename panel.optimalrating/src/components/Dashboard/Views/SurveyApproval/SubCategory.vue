<template>
  <div class="SubCategory">
    <div style="display: flex">
      <div class="CategoryText" @click="toggle">
        <i
          :class="`fa fa-caret-${visible ? 'down' : 'right'}`"
          :style="data.surveys && data.surveys.length > 0 ? '' : 'opacity: 0;'"
        />
        {{data.name}}
      </div>
      <div style="margin-left: auto">
        <toggle-button
          color="#82C7EB"
          :sync="true"
          :height="20"
          :width="40"
          :value="data.status === 'active'"
          @change="changeStatus"
        />
        <!-- <i class="fa fa-pencil-square-o" @click="$modal.show('categoryEditModal')" />
        <i class="fa fa-trash" @click="onDelete" />-->
      </div>
    </div>
    <div v-if="data.surveys && data.surveys.length > 0 && visible" class="SubCategories">
      <Survey v-for="survey in data.surveys" :key="survey.id" :data="survey" />
    </div>
    <modal name="categoryEditModal" :classes="['v--modal', 'm-modal']" height="auto">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('categoryEditModal')"
              ></i>
              <h4 class="mt-0">Edit Category</h4>
              <hr />
              <div style="font-weight: bold">Name</div>
              <input class="form-control" v-model="editData.name" />
              <div style="font-weight: bold; margin-top: 20px">Keyword</div>
              <input class="form-control" v-model="editData.code" />
              <div style="font-weight: bold; margin-top: 20px">Status</div>
              <switches
                v-model="editData.status"
                :text-enabled="$t('common.buttons.active')"
                :text-disabled="$t('common.buttons.passive')"
              ></switches>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-simple btn-sm px-3"
          @click="$modal.hide('categoryEditModal')"
        >Cancel</button>
        <button
          type="button"
          :disabled="saving"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="save"
        >{{saving ? 'Saving...' : 'Save'}}</button>
      </div>
    </modal>
  </div>
</template>
<script>
import Survey from "./Survey";
export default {
  name: "SubCategory",
  components: {
    Survey
  },
  props: ["data"],
  data() {
    return {
      saving: false,
      visible: false,
      editData: {}
    };
  },
  mounted() {
    this.editData = { ...this.data, status: this.data.status === "active" };
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    changeStatus(val) {
      this.$store
        .dispatch("definition/updateCategory", {
          id: this.data.id,
          data: { status: val ? "active" : "passive" }
        })
        .then(() => {
          this.data.status = val ? "active" : "passive";
          this.editData.status = val ? "active" : "passive";
        });
    },
    onDelete() {
      this.$modal.show("dialog", {
        title: "Delete Category",
        text: "Are you sure?",
        buttons: [
          { title: "Cancel" },
          {
            title: "Okay",
            class: "btn btn-danger btn-fill",
            handler: () => {
              this.$modal.hide("dialog");
              this.$store
                .dispatch("definition/deleteCategory", { data: this.data })
                .then(() => {
                  this.notify("Deleted successfully.", "success");
                })
                .catch(() => {});
            }
          }
        ]
      });
    },
    save() {
      this.saving = true;
      let data = {
        id: this.editData.id,
        code: this.editData.code,
        status: this.editData.status,
        name: this.editData.name
      };
      data.status = data.status ? "active" : "passive";
      this.$store
        .dispatch("definition/updateCategory", { id: data.id, data })
        .then(() => {
          this.saving = false;
          this.$modal.hide("categoryEditModal");
        })
        .catch(() => {
          this.saving = false;
        });
    }
  }
};
</script>