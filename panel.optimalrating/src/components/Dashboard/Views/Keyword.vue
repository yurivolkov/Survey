<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-8">
          <h4 class="mb-4 mt-2">{{$t('common.keyword.labels.list')}}</h4>
          <input
            id="statusApproved"
            value="approved"
            type="checkbox"
            v-model="hideSystem"
            @change="onHide"
          />
          <label for="statusApproved">Hide system messages</label>
        </div>
        <div class="col-4">
          <button
            type="button"
            name="button"
            class="btn btn-sm btn-fill btn-round btn-primary float-right mb-2 mt-2"
            @click="openModal('save')"
          >
            <i class="fas fa-plus"></i>
            {{$t('common.buttons.new')}}
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <card>
                <datatable
                  :class="{'loading-table': loading}"
                  v-if="datatable.data"
                  v-bind="datatable"
                />
              </card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal name="keyword-modal" height="auto" :draggable="true" :classes="['v--modal', 'm-modal']">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('keyword-modal')"
              ></i>
              <h4 class="mt-0">{{$t('common.keyword.labels.new')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.keyword.input.keyword')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="keyword.key" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.keyword.input.default')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="keyword.default" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-simple btn-sm px-3"
          @click="$modal.hide('keyword-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveKeyword"
          :disabled="saving"
        >{{saving ? 'Saving...' : $t('common.buttons.save')}}</button>
      </div>
    </modal>
  </div>
</template>
<script>
import Vue from "vue";
import Card from "src/components/UIComponents/Cards/Card.vue";
import TableCustomColumn from "src/components/UIComponents/DataTable/TableCustomColumn";
import TableActions from "src/components/UIComponents/DataTable/TableActions";
import { mapState, mapGetters } from "vuex";
import { Keyword } from "src/models/definition";

export default {
  components: {
    Card,
    TableActions,
    TableCustomColumn
  },
  data() {
    return {
      hideSystem: true,
      fullData: [],
      saving: false,
      loading: false,
      selectedBanner: null,
      keyword: new Keyword(),
      mode: "save",
      datatable: {
        Pagination: false,
        columns: [
          { title: "", field: "index" },
          {
            title: this.$t("common.keyword.datatable.key"),
            field: "key",
            tdComp: TableCustomColumn
          },
          {
            title: this.$t("common.keyword.datatable.default"),
            field: "default",
            tdComp: TableCustomColumn
          },
          {
            tdComp: TableActions,
            visible: "true",
            thStyle: { width: "10%" },
            tdStyle: { width: "10%" }
          }
        ],
        data: [],
        total: 0,
        query: { sort: "id", order: "asc" },
        selection: this.selection ? [] : null,
        HeaderSettings: false,
        supportNested: true,
        supportBackup: true,
        xprops: {
          eventbus: new Vue()
        }
      },
      bus: new Vue()
    };
  },
  watch: {
    "datatable.query": {
      handler(query) {
        this.getAllKeywords();
      },
      deep: true
    }
  },
  computed: {
    ...mapState("definition", {
      keywords: state => state.keywords
    })
  },
  created() {
    this.datatable.xprops.eventbus.$on("edit", item => {
      this.edit(item);
    });
    this.datatable.xprops.eventbus.$on("delete", item => {
      this.delete(item);
    });
  },
  methods: {
    onHide() {
      let _d = this.hideSystem
        ? this.fullData.filter(x => x.key.split(".").length < 3)
        : [...this.fullData];
      this.datatable.data = _d.map((x, i) => ({ ...x, index: i + 1 }));
    },
    getAllKeywords() {
      let query = this.datatable.query;
      if (query.sort == "name") {
        query.sort = `${query.sort}.${this.$store.getters["account/getActiveLanguage"].code}`;
      }
      let filter = {
        sort: query.sort,
        order: query.order,
        limit: query.limit,
        offset: query.offset
      };
      this.loading = true;
      this.$store
        .dispatch("definition/getAllKeywords", { filter: filter })
        .then(response => {
          this.fullData = [...response.set];
          this.onHide();
          this.loading = false;
        });
    },
    edit(item) {
      this.mode = "edit";
      this.keyword = item;
      this.$modal.show("keyword-modal");
    },
    delete(item) {
      this.$modal.show("dialog", {
        title: "Warning!!",
        text: `${item.default} will be deleted. Are you sure?`,
        buttons: [
          {
            title: "Cancel"
          },
          {
            title: "Yes",
            class: "btn btn-danger btn-fill",
            handler: () => {
              this.$store
                .dispatch("definition/deleteKeyword", { data: item })
                .then(() => {
                  this.notify("Keyword Deleted.", "success");
                  this.$modal.hide("dialog");
                  this.getAllKeywords();
                });
            }
          }
        ]
      });
    },
    openModal(mode) {
      if (mode === "save") {
        this.mode = "save";
        this.keyword = new Keyword();
        this.$modal.show("keyword-modal");
      }
    },
    saveKeyword() {
      this.saving = true;
      if (this.mode === "save") {
        this.$store
          .dispatch("definition/createKeyword", { data: this.keyword })
          .then(response => {
            this.saving = false;
            this.getAllKeywords();
            this.$modal.hide("keyword-modal");
            this.notify(this.$t(response.message), "success");
          })
          .catch(error => {
            this.saving = false;
            this.notify(this.$t(response.message), "err");
          });
      } else {
        this.$store
          .dispatch("definition/updateKeyword", { data: this.keyword })
          .then(response => {
            this.saving = false;
            this.getAllKeywords();
            this.$modal.hide("keyword-modal");
            this.notify(this.$t(response.message), "success");
          })
          .catch(error => {
            this.saving = false;
            this.getAllKeywords();
            this.$modal.hide("keyword-modal");
            this.notify(this.$t(response.message), "err");
          });
      }
    }
  }
};
</script>
<style>
</style>
