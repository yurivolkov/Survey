<template>
  <div class="category-detail">
    <div class="d-flex align-items-center mb-4">
      <h5 class="text-danger m-0">{{$t('common.category.components.list')}}</h5>
      <button
        type="button"
        class="btn btn-primary btn-round btn-sm ml-auto"
        @click.prevent="newCategory"
      >
        <i class="fas fa-plus mr-1"></i>
        {{$t('common.buttons.new')}}
      </button>
    </div>
    <div class="row">
      <div class="col">
        <category-form
          :item="category"
          :whichForm="'category'"
          @save="save"
          @remove="remove"
          :saving="saving"
        ></category-form>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryForm from "src/components/Dashboard/Views/Category/CategoryForm";

import { Category } from "src/models/definition";
import Vue from "vue";

export default {
  props: ["item", "bus"],
  components: {
    CategoryForm
  },
  data() {
    return {
      saving: false,
      imageUrl: process.env.CDN_LOCATION,
      isChanged: false,
      uploadedImage: null,
      formMode: "new",
      category: new Category()
    };
  },
  watch: {
    item: function() {
      this.isChanged = false;
    },
    category: function() {
      if (this.category.id) {
        if (this.category.category)
          this.category.category = this.category.category.id;
        if (this.category.dateCreated) delete this.category.dateCreated;
        if (this.category.dateUpdated) delete this.category.dateUpdated;
        this.formMode = "edit";
      } else {
        this.formMode = "new";
      }
    }
  },
  computed: {},
  methods: {
    newCategory() {
      this.category = new Category();
    },
    save() {
      this.saving = true;
      if (this.formMode == "new") {
        this.$store
          .dispatch("definition/createCategory", { data: this.category })
          .then(() => {
            this.saving = false;
            this.notify("Category created.", "success");
            this.newCategory();
            this.$emit("save");
          })
          .catch(() => {
            this.saving = false;
            this.notify("Category could not be created.", "error");
          });
      } else if (this.formMode == "edit") {
        this.$store
          .dispatch("definition/updateCategory", {
            id: this.category.id,
            data: this.category
          })
          .then(() => {
            this.saving = false;
            this.notify("Category updated.", "success");
            this.$emit("save");
          })
          .catch(() => {
            this.saving = false;
            this.notify("Category could not be updated.", "error");
          });
      }
    },
    remove() {
      this.$store
        .dispatch("definition/getChildren", this.category)
        .then(response => {
          let message = `Are you sure to delete this category?`;
          let countChild = response.length;
          if (countChild > 0)
            message = `There are ${countChild} subcategories linked to this category? Are you sure to delete this category?`;

          this.$modal.show(
            "dialog",
            {
              title: "Attention!",
              text: message,
              classes: "test",
              buttons: [
                { title: "Cancel" },
                {
                  title: "Okay",
                  class: "btn btn-danger btn-fill",
                  handler: () => {
                    this.$modal.hide("dialog");
                    this.loading = true;
                    this.$store
                      .dispatch("definition/deleteCategory", {
                        data: this.category
                      })
                      .then(() => {
                        this.loading = false;
                        this.notify(
                          "Category has been deleted successfully.",
                          "success"
                        );
                        this.bus.$emit("update-list");
                      });
                  }
                }
              ]
            },
            { classes: "test" }
          );
        })
        .catch(error => {
          //this.notify('Kategori  silinirken bir hata oluştu.', 'error');
        });
    },

    notify(message, status) {
      new Vue({
        created() {
          this.$notify({
            message: message,
            horizontalAlign: "right",
            verticalAlign: "top",
            type: status
          });
        }
      });
    }
  }
};
</script>

<style lang="css">
</style>
