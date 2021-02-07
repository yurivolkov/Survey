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
    <modal
      name="translation-modal"
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
                @click="$modal.hide('translation-modal')"
              ></i>
              <h4 class="mt-0">{{$t('common.keyword.labels.translation')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.keyword.input.keyword')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="keyword.default" disabled />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.keyword.input.translation')}} :</label>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      v-model="keyword.translation.translation "
                    />
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
          @click="$modal.hide('translation-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveTranslation"
          :disabled="saving"
        >{{ saving ? 'Saving...' : $t('common.buttons.save') }}</button>
      </div>
    </modal>
  </div>
</template>
<script>
import Vue from "vue";
import Card from "src/components/UIComponents/Cards/Card.vue";
import TableCustomColumn from "src/components/UIComponents/DataTable/TableCustomColumn";
import KeywordActions from "src/components/Dashboard/Views/CountryAdmin/Keyword/KeywordActions";
import { mapState, mapGetters } from "vuex";
import { Keyword, Translation } from "src/models/definition";

export default {
  components: {
    Card,
    TableCustomColumn
  },
  data() {
    return {
      hideSystem: true,
      fullData: [],
      loading: false,
      saving: false,
      selectedBanner: null,
      keyword: new Keyword(),
      mode: "save",
      datatable: {
        Pagination: false,
        columns: [
          { title: "", field: "index" },
          {
            title: this.$t("common.keyword.datatable.default"),
            field: "default",
            tdComp: TableCustomColumn
          },
          {
            title: this.$t("common.keyword.datatable.translation"),
            field: "translation.translation",
            tdComp: TableCustomColumn
          },
          {
            tdComp: KeywordActions,
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
      _keywords: state => state.keywords
    }),
    keywords: function() {
      return this._.cloneDeep(this._keywords);
    }
  },
  created() {
    this.datatable.xprops.eventbus.$on("add-key", item => {
      this.addKey(item);
      item = null;
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
    addKey(item) {
      let translation = new Translation();
      if (item.translation == null) {
        item.translation = translation;
        this.mode = "save";
      } else {
        this.mode = "edit";
      }

      this.keyword = item;
      this.$modal.show("translation-modal");
    },
    saveTranslation() {
      this.saving = true;
      this.$store
        .dispatch("definition/saveTranslation", {
          mode: this.mode,
          data: this.keyword
        })
        .then(response => {
          this.getAllKeywords();
          this.saving = false;
          this.datatable.data = null;
          this.$modal.hide("translation-modal");
          this.notify(this.$t(response.message), "success");
        })
        .catch(error => {
          this.saving = false;
          //console.log(error);
        });
    }
  }
};
</script>
<style>
</style>
