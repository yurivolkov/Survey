<template>
  <div class="container-fluid">
    <h4 class="mb-4 mt-2 text-danger" @click="test()">
      Pending Categories
      <i
        @click="collapsed = !collapsed"
        :class="`fa fa-caret-${collapsed ? 'right' : 'down'}`"
        style="color: #333; cursor: pointer; margin-left: 10px;"
      />
    </h4>
    <card v-if="!collapsed" class="col-12 float-left">
      <div class="col">
        <datatable :class="{'loading-table': loading}" v-if="datatable.data" v-bind="datatable" />
      </div>
      <modal
        name="category-detail-modal"
        height="auto"
        :draggable="true"
        :classes="['v--modal', 'm-modal']"
      >
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col">
                <i
                  class="fas fa-times fa-2x btn-modal-close text-success"
                  slot="top-right"
                  @click="$modal.hide('category-detail-modal')"
                ></i>
                <h4 class="mt-0">{{$t('common.category.components.detail')}}</h4>
                <hr />
                <category-form :nodisable="true" :item="category" :whichForm="'survey'" @save="save" @remove="remove"></category-form>
              </div>
            </div>
          </div>
        </div>
      </modal>
    </card>
  </div>
</template>

<script>
import Vue from "vue";
import Card from "src/components/UIComponents/Cards/Card.vue";
import WaitCategoryTableActions from "src/components/Dashboard/Views/Dashboard/ShowTableActions";
import DetailModal from "src/components/Dashboard/Views/Dashboard/DetailModal";
import TableCustomColumn from "src/components/UIComponents/DataTable/TableCustomColumn";
import TableStatus from "src/components/UIComponents/DataTable/TableStatus";
import CategoryForm from "src/components/Dashboard/Views/Category/CategoryForm";
import { Category } from "../../../../models/definition";
export default {
  props: ["bus", "categories"],
  components: {
    Card,
    DetailModal,
    TableCustomColumn,
    WaitCategoryTableActions,
    TableStatus,
    CategoryForm
  },
  data() {
    return {
      collapsed: false,
      loading: false,
      category: null,
      datatable: {
        columns: [
          {
            title: this.$t("common.category.datatable.name"),
            field: "name",
            tdComp: TableCustomColumn
          },
          {
            title: this.$t("common.category.datatable.parent_name"),
            field: "parent.name",
            tdComp: TableCustomColumn
          },
          {
            title: this.$t("common.category.datatable.status"),
            field: "status",
            tdComp: TableCustomColumn
          },
          {
            tdComp: WaitCategoryTableActions,
            visible: "true",
            thStyle: { width: "30%" },
            tdStyle: { width: "30%" }
          }
        ],
        data: null,
        total: 0,
        query: { sort: "id", order: "asc" },
        selection: this.selection ? [] : null,
        HeaderSettings: false,
        supportNested: true,
        supportBackup: true,
        xprops: {
          eventbus: new Vue()
        }
      }
    };
  },
  created() {
    this.datatable.xprops.eventbus.$on("detail", item => {
      this.category = item;

      this.$modal.show("category-detail-modal");
    });

    this.datatable.xprops.eventbus.$on("status", item => {
      this.updateStatus(item);
    });
    this.getAllDashboardData();
    this.getCategories(0);
  },
  methods: {
    save() {
      let category = new Category();

      category.parent = this.category.parent.id;
      category.name = this.category.name;
      category.description = this.category.description;
      category.code = this.category.code;
      category.status = this.category.status;
      category.sort_order = this.category.sort_order;

      this.$store
        .dispatch("definition/updateCategory", {
          id: this.category.id,
          data: category
        })
        .then(() => {
          this.getAllDashboardData();
          this.notify("Category update.", "success");
          this.$emit("save");
          this.$modal.hide("category-detail-modal");
        })
        .catch(() => {
          this.notify("Categori update error.", "error");
          this.$modal.hide("category-detail-modal");
        });
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
                        this.getAllDashboardData();
                        this.bus.$emit("update-list");
                        this.$modal.hide("category-detail-modal");
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
    updateStatus(item) {
      this.$store
        .dispatch("definition/updateCategoryStatus", {
          id: item.id,
          status: item.status
        })
        .then(response => {
          this.getAllDashboardData();
        });
    },
    getCategories(parentId) {
      this.loading = true;
      this.$store
        .dispatch("definition/getAllCategoryTree", {
          filter: { sort: ["+listOrder"] }
        })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getAllDashboardData() {
      this.$store.dispatch("definition/getAllDashboardData").then(response => {
        this.datatable.data = response.categories;
      });
    }
  }
};
</script>
