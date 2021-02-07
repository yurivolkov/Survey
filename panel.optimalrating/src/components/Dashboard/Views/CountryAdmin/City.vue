<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-8">
          <h4 class="mb-4 mt-2">{{$t('common.country.labels.list')}}</h4>
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
    <modal name="city-modal" height="auto" :draggable="true" :classes="['v--modal', 'm-modal']">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('city-modal')"
              ></i>
              <h4 class="mt-0">{{$t('common.city.labels.new')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.city.input.name')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="city.name" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.city.input.order')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="city.order" />
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
          @click="$modal.hide('city-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveCity"
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
import TableColumnStatus from "src/components/UIComponents/DataTable/TableColumnStatus";
import TableActions from "src/components/UIComponents/DataTable/TableActions";
import { mapState, mapGetters } from "vuex";
import { City } from "src/models/definition";

export default {
  components: {
    Card,
    TableCustomColumn,
    TableActions,
    TableColumnStatus
  },
  data() {
    return {
      saving: false,
      loading: false,
      selectedBanner: null,
      city: new City(),
      mode: "save",
      datatable: {
        columns: [
          { title: "ID", field: "id", sortable: true },
          {
            title: this.$t("common.city.datatable.name"),
            field: "name",
            tdComp: TableCustomColumn
          },
          {
            title: this.$t("common.city.datatable.order"),
            field: "order",
            sortable: true,
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
        this.init();
      },
      deep: true
    }
  },
  computed: {
    ...mapState("account", {
      _auth_country: state => state.country
    }),

    ...mapState("definition", {
      _cities: state => state.cities
    }),

    auth_country: function() {
      return this._.cloneDeep(this._auth_country);
    },
    cities: function() {
      return this._.cloneDeep(this._cities);
    }
  },
  created() {
    this.init();
    this.datatable.xprops.eventbus.$on("edit", item => {
      this.edit(item);
    });
    this.datatable.xprops.eventbus.$on("delete", item => {
      this.delete(item);
    });
  },
  methods: {
    init() {
      this.$store.dispatch("account/init").then(() => {
        this.getAllCities();
      });
    },
    getAllCities() {
      let query = this.datatable.query;
      if (query.sort == "name") {
        query.sort = `${query.sort}.${this.$store.getters["account/getActiveLanguage"].code}`;
      }
      let filter = {
        sort: query.sort,
        order: query.order,
        limit: query.limit,
        offset: query.offset,
        id: this.auth_country.id
      };
      this.loading = true;
      this.$store
        .dispatch("definition/getAllCities", { filter: filter })
        .then(response => {
          this.loading = false;
          this.datatable.data = this.cities;
          this.datatable.total = response.recordCount;
        });
    },
    openModal(mode) {
      if (mode === "save") {
        this.mode = "save";
        this.city = new City();
        this.$modal.show("city-modal");
      }
    },
    edit(item) {
      this.mode = "edit";
      this.city = item;
      this.$modal.show("city-modal");
    },
    delete(item) {
      this.$modal.show("dialog", {
        title: "Warning!!",
        text: `${item.name} will be deleted. Are you sure?`,
        buttons: [
          {
            title: "Cancel"
          },
          {
            title: "Yes",
            class: "btn btn-danger btn-fill",
            handler: () => {
              this.$store
                .dispatch("definition/deleteCity", { data: item })
                .then(() => {
                  this.notify("City Deleted.", "success");
                  this.$modal.hide("dialog");
                  this.getAllCities();
                });
            }
          }
        ]
      });
    },
    saveCity() {
      this.saving = true;
      if (this.mode === "save") {
        this.$store
          .dispatch("definition/createCity", { data: this.city })
          .then(response => {
            this.saving = false;
            this.getAllCities();
            this.datatable.data = null;
            this.$modal.hide("city-modal");
            this.notify(this.$t(response.message), "success");
          })
          .catch(error => {
            this.saving = false;
            //console.log(error);
          });
      } else {
        this.$store
          .dispatch("definition/updateCity", { data: this.city })
          .then(response => {
            this.saving = false;
            if (response.code === 200) {
              this.getAllCities();
              this.$modal.hide("city-modal");
              this.notify(this.$t(response.message), "success");
            }
          })
          .catch(error => {
            this.saving = false;
            this.notify(this.$t(response.message), "err");
          });
      }
    }
  }
};
</script>
<style>
</style>
