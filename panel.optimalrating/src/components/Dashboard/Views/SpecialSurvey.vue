<template>
  <div class="content">
    <data-table
      :bus="bus"
      :title="$t('common.special.labels.list')"
      :loading="loading"
      :datatable="datatable"
    ></data-table>
    <modal name="special-modal" height="auto" :draggable="true" :classes="['v--modal', 'm-modal']">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('special-modal')"
              ></i>
              <h4 class="mt-0" v-if="mode === 'edit'">{{$t('common.special.labels.edit')}}</h4>
              <h4 class="mt-0" v-else>{{$t('common.special.labels.new')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.special.input.title')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="special.title" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.special.input.expire_at')}} :</label>
                  <div class="col-8">
                    <date-range-picker
                      :locale-data="locale"
                      class="col-12 p-0"
                      v-model="dateRange"
                      :date-format="dateFormat"
                      :opens="opens"
                    ></date-range-picker>
                  </div>
                </div>
                <!--<div class="form-group row">
                                    <label class="col-4 col-form-label">{{$t('common.special.input.show_on_home_page')}} :</label>
                                    <toggle-button color="#82C7EB" :sync="true" :height="20" :width="40" style="margin-left: 15px; margin-top:5px" v-model="special.show_on_home"/>
                </div>-->
                <div class="form-group row">
                  <button
                    type="button"
                    name="button"
                    class="btn btn-sm btn-fill btn-round btn-primary float-right mb-2 mt-2"
                    @click="addAnotherAnswer"
                  >
                    <i class="fas fa-plus"></i>
                    {{$t('common.special.input.add_option')}}
                  </button>
                </div>
                <div class="form-group row" v-for="(option, index) in choices">
                  <label class="col-4 col-form-label">{{$t('common.special.input.option')}} :</label>
                  <div class="col-4">
                    <input type="text" class="form-control" v-model="option.choice_title" />
                  </div>
                  <div class="col-4" v-if="index > 1">
                    <button
                      type="button"
                      name="button"
                      class="btn btn-sm btn-fill btn-round btn-danger float-right mb-2 mt-2"
                      @click="removeAnswer(index)"
                    >
                      <i class="fas fa-plus"></i>
                      {{$t('common.special.input.remove_answer')}}
                    </button>
                  </div>
                </div>

                <div class="clearfix"></div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">Subject :</label>
                  <div class="col-8">
                    <treeselect
                      v-model="selectedSubject"
                      :options="subjectOptions"
                      placeholder="Subject"
                      :multiple="true"
                      valueFormat="label"
                      :flat="true"
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
          @click="$modal.hide('special-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveSpecial"
          :disabled="saving"
        >{{saving ? 'Saving...' : $t('common.buttons.save')}}</button>
      </div>
    </modal>
  </div>
</template>
<style>
.reportrange-text {
  line-height: normal !important;
}
.v--modal-overlay .v--modal-box {
  overflow: unset !important;
}
</style>
<script>
import Vue from "vue";
import TableCustomColumn from "src/components/UIComponents/DataTable/TableCustomColumn";
import TableActions from "src/components/Dashboard/Views/SpecialSurvey/TableActions";
import TableShowOnHome from "src/components/Dashboard/Views/SpecialSurvey/TableShowOnHome";
import DateMonthColumn from "src/components/UIComponents/DataTable/DateMonthColumn";
import DataTable from "src/components/Dashboard/Views/SpecialSurvey/SpecialDataTable";
import { Special, Choice } from "src/models/definition";
import { mapState, mapGetters } from "vuex";

import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: {
    TableCustomColumn,
    TableActions,
    DataTable,
    DateMonthColumn,
    DateRangePicker,
    TableShowOnHome
  },
  data() {
    return {
      saving: false,
      picker: null,
      opens: "right",
      singleDatePicker: false,
      timePicker: false,
      showDropdowns: true,
      showWeekNumbers: false,
      timePicker24Hour: false,
      linkedCalendars: false,
      autoApply: false,
      locale: {
        direction: "ltr",
        format: "yyyy-mm-dd",
        separator: " - ",
        applyLabel: "Apply",
        cancelLabel: "Cancel",
        weekLabel: "W",
        customRangeLabel: "Custom Range",
        daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        monthNames: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        firstDay: 0
      },
      dateRange: {
        startDate: null,
        endDate: null
      },
      loading: false,
      selectedBanner: null,
      special: new Special(),
      choice: new Choice(),
      choices: [],
      subjects: [],
      subjectOptions: [],
      selectedSubject: null,
      selectedOnHomePage: false,
      mode: "save",
      fakeItem: null,
      datetime: new Date(),
      specialDateRange: [],
      datatable: {
        columns: [
          { title: "ID", field: "id", sortable: true },
          {
            title: this.$t("common.special.datatable.title"),
            field: "title",
            tdComp: TableCustomColumn
          },
          {
            title: this.$t("common.special.datatable.date"),
            field: "start_at",
            tdComp: DateMonthColumn
          },
          { title: this.$t("Start Date"), field: "start_at" },
          { title: this.$t("End Date"), field: "expire_at" },
          {
            title: this.$t("common.special.datatable.show_on_home"),
            field: "show_on_home",
            tdComp: TableShowOnHome
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
        query: {
          sort: "id",
          order: "asc",
          year: null
        },
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
        this.getAllSpecialSurvey();
      },
      deep: true
    },
    datetime: function(item) {
      return item;
    },
    specialSurveys: function(item) {
      //console.log(item);
    },
    selectedSubject: function(val) {
      if (typeof val !== "undefined" || null === val) {
        this.special.subjects = [];
        this._.map(val, item => {
          this.special.subjects.push(item.id);
        });
      }
    }
  },
  created() {
    this.addAnotherAnswer();
    this.addAnotherAnswer();
    this.datatable.xprops.eventbus.$on("openModal", function() {
      this.special = new Special();
      this.choice = new Choice();
      this.mode = "edit";
      this.$modal.show("special-modal");
    });
    this.datatable.xprops.eventbus.$on("edit", item => {
      this.edit(item);
    });
    this.datatable.xprops.eventbus.$on("status", item => {
      this.statusUpdate(item);
    });
    this.datatable.xprops.eventbus.$on("show_on_home", item => {
      this.showOnHomeUpdate(item);
    });
    this.datatable.xprops.eventbus.$on("delete", item => {
      this.delete(item);
    });
    this.datatable.xprops.eventbus.$on("yearSelected", item => {
      this.year = item;
      this.getAllSpecialSurvey();
    });
    this.datatable.xprops.eventbus.$on("monthSelected", item => {
      this.month = item;
      this.getAllSpecialSurvey();
    });
    this.datatable.xprops.eventbus.$on("refresh", item => {
      this.getAllSpecialSurvey();
    });
    this.$store.dispatch("definition/getAllSubjects").then(subjects => {
      this.subjectOptions = this._.map(subjects.set, item => {
        return {
          id: item.id,
          label: item.title
        };
      });
      this.subjectOptions = this._.orderBy(
        this.subjectOptions,
        ["label"],
        ["asc"]
      );
    });
  },
  computed: {
    ...mapState("definition", {
      _specialSurveys: state => state.specialSurveys
    }),
    specialSurveys: function() {
      return this._.cloneDeep(this._specialSurveys);
    }
  },
  methods: {
    showOnHomeUpdate(item) {
      this.$store
        .dispatch("definition/updateShowOnHome", {
          id: item.id,
          show_on_home: item.show_on_home
        })
        .then(response => {
          this.notify("Updated successfully.", "success");
          this.getAllSpecialSurvey();
        });
    },
    dateFormat(classes, date) {
      if (!classes.disabled) {
        this._.forEach(this.specialDateRange, item => {
          let start = new Date(item.start_at).getTime();
          let end = new Date(item.expire_at);
          end = end.setDate(end.getDate() + 1);
          classes.disabled = start <= date && date <= end;
        });
      }
      return classes;
    },
    edit(item) {
      this.mode = "edit";
      this.$store
        .dispatch("definition/getDetailSurvey", { id: item.id })
        .then(response => {
          this.special = response.result.set;
          this.dateRange.startDate = this.special.start_at;
          this.dateRange.endDate = this.special.expire_at;
          // let choices = this._.orderBy(this.special.choices, ["id"], ["asc"]);
          let choices = this.special.choices;
          this.choices = this._.map(choices, option => {
            return {
              id: option.id,
              choice_title: option.choice_title
            };
          });
          let subject = [];
          this.selectedSubject = [];
          subject.push(
            this._.map(this.special.subjects, item => {
              return {
                id: item.id
              };
            })
          );
          this.selectedSubject = subject.length > 0 ? subject[0] : [];

          this.$modal.show("special-modal");
        });
    },
    delete(item) {
      this.$modal.show("dialog", {
        title: "Warning!!",
        text: `${item.title} will be deleted. Are you sure?`,
        buttons: [
          {
            title: "Cancel"
          },
          {
            title: "Yes",
            class: "btn btn-danger btn-fill",
            handler: () => {
              this.$store
                .dispatch("definition/deleteSpecialSurvey", { data: item })
                .then(() => {
                  this.notify("Survey deleted.", "success");
                  this.$modal.hide("dialog");
                  this.getAllSpecialSurvey();
                });
            }
          }
        ]
      });
    },
    addAnotherAnswer() {
      let choice = this._.cloneDeep(this.choice);
      this.choices.push(choice);
      return false;
    },
    removeAnswer(index) {
      let _this = this;
      let newChoices = this.choices.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentIndex == index) {
            _this.$store.dispatch("definition/deleteChoices", {
              id: currentValue.id
            });
          }
          if (currentIndex !== index) {
            accumulator.push(currentValue);
          }
          return accumulator;
        },
        []
      );
      this.choices = newChoices;
    },
    saveSpecial() {
      this.saving = true;
      let endDate = new Date(this.dateRange.endDate);
      let startDate = new Date(this.dateRange.startDate);

      this.special.expire_at = endDate;
      this.special.start_at = startDate;

      if (this.mode === "edit") {
        this.special.choices = this.choices.map(x => ({
          ...x,
          choice_description: ""
        }));

        this.$store
          .dispatch("definition/updateSpecialSurvey", {
            id: this.special.id,
            data: this.special
          })
          .then(response => {
            this.saving = false;
            this.getAllSpecialSurvey();
            this.$modal.hide("special-modal");
            this.notify(this.$t(response.message), "success");
          })
          .catch(() => (this.saving = false));
      } else {
        this.special.choices = this.choices;
        this.$store
          .dispatch("definition/createSpecialSurvey", { data: this.special })
          .then(response => {
            this.saving = false;
            this.getAllSpecialSurvey();
            this.$modal.hide("special-modal");
            this.notify(this.$t(response.message), "success");
          })
          .catch(() => (this.saving = false));
      }
    },
    statusUpdate(item) {
      this.$store
        .dispatch("definition/updateSurveyStatus", {
          id: item.id,
          status: item.status === "active" ? 1 : 0
        })
        .then(response => {
          this.notify("Updated successfully.", "success");
          this.getAllSpecialSurvey();
        });
    },
    getAllSpecialSurvey() {
      let query = this.datatable.query;
      let filter = {
        sort: query.sort,
        order: query.order,
        limit: query.limit,
        offset: query.offset,
        year: this.year,
        month: this.month
      };
      this.$store
        .dispatch("definition/getAllSpecialSurvey", { filter: filter })
        .then(response => {
          this.loading = false;
          this.datatable.data = this.specialSurveys;
        });
      this.$store.dispatch("definition/specialDateRange").then(response => {
        this.specialDateRange = response;
      });
    },
    fakeVote(item) {
      this.$store
        .dispatch("definition/fakeVote", { id: item.id })
        .then(response => {
          this.notify("Updated successfully.", "success");
          this.getAllSpecialSurvey();
        });
    }
  }
};
</script>
