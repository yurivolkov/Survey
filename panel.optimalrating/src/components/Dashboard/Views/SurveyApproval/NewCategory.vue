<template>
  <div style="text-align: right; margin-bottom: 16px">
    <button class="btn" @click="$modal.show('categoryCreateModal')">Add new category</button>
    <modal name="categoryCreateModal" :classes="['v--modal', 'm-modal']" height="auto">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('categoryCreateModal')"
              ></i>
              <h4 class="mt-0">Create Category</h4>
              <hr />
              <div style="font-weight: bold">Name</div>
              <input class="form-control" v-model="name" />
              <div style="font-weight: bold; margin-top: 20px">Translation Code</div>
              <input class="form-control" v-model="code" />
              <div style="font-weight: bold; margin-top: 20px">Parent Category</div>
              <treeselect
                v-model="parent"
                :options="categoryOptions"
                placeholder="Üst Kategori"
                valueFormat="id"
              />
              <div style="font-weight: bold; margin-top: 20px">Sort Order</div>
              <input type="number" class="form-control" v-model="sort_order" />
              <div style="font-weight: bold; margin-top: 20px">Status</div>
              <switches
                v-model="status"
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
import { mapState } from "vuex";
export default {
  name: "NewCategory",
  data() {
    return {
      saving: false,
      name: "",
      code: "",
      sort_order: 0,
      parent: 0,
      status: true
    };
  },
  computed: {
    ...mapState("definition", {
      categories: state => state.categories
    }),
    categoryOptions: function() {
      let _this = this;
      function mapChildren(children) {
        return _this._.map(children, child => {
          let obj = {
            id: child.id,
            label: child.name || ""
          };
          if (child.children) obj.children = mapChildren(child.children);
          return obj;
        });
      }

      return this._.map(this.categories, item => {
        let obj = {
          id: item.id,
          label: item.name || ""
        };
        if (item.children) obj.children = mapChildren(item.children);
        return obj;
      });
    }
  },
  methods: {
    save() {
      let { name, code, sort_order, parent, status } = this;
      let data = {
        name,
        code,
        sort_order,
        parent,
        status: status ? "active" : "passive"
      };
      this.saving = true;
      this.$store
        .dispatch("definition/createCategory", { data })
        .then(() => {
          this.saving = false;
          this.$modal.hide("categoryCreateModal");
          this.name = "";
          this.code = "";
          this.sort_order = 0;
          this.parent = 0;
          this.status = true;
        })
        .catch(() => {
          this.saving = false;
        });
    }
  }
};
</script>