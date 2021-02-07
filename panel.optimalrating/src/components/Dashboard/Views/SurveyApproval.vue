<template>
  <div>
    <waiting-categories></waiting-categories>
    <waiting-choices></waiting-choices>
    <waiting-surveys></waiting-surveys>
    <div class="clearfix"></div>
    <div class="content">
      <data-table
        :bus="bus"
        :title="$t('common.survey.labels.list')"
        :loading="loading"
        :datatable="datatable"
      ></data-table>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import TableCustomColumn from "src/components/UIComponents/DataTable/TableCustomColumn";
import CreatedBy from "src/components/UIComponents/DataTable/CreatedBy";
import TableStatus from "src/components/Dashboard/Views/Survey/TableStatus";
import TableActions from "src/components/Dashboard/Views/Survey/SurveyTableActions";
import DateMonthColumn from "src/components/UIComponents/DataTable/DateMonthColumn";
import DataTable from "src/components/Dashboard/Views/Survey/SurveyDataTable";
import WaitingCategories from "src/components/Dashboard/Views/Dashboard/WaitingCategories.vue";
import WaitingChoices from "src/components/Dashboard/Views/Dashboard/WaitingChoices.vue";
import WaitingSurveys from "src/components/Dashboard/Views/Dashboard/WaitingSurveys.vue";
import { Special, Choice } from "src/models/definition";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    TableCustomColumn,
    TableActions,
    TableStatus,
    DataTable,
    DateMonthColumn,
    WaitingCategories,
    WaitingChoices,
    WaitingSurveys,
    CreatedBy
  },
  data() {
    return {
      loading: false,
      selectedBanner: null,
      survey: new Special(),
      choice: new Choice(),
      choices: [],
      subjects: [],
      subjectOptions: [],
      selectedSubject: null,
      mode: "save",
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
          {
            title: "Created By",
            field: "user_id",
            tdComp: CreatedBy
          },
          {
            title: this.$t("common.special.datatable.status"),
            field: "status",
            tdComp: TableStatus
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
          year: null,
          status: 0
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
        this.getAllSurveys();
      },
      deep: true
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

      this.$modal.show("special-modal");
    });
    this.datatable.xprops.eventbus.$on("refresh", item => {
      this.getAllSurveys();
    });
    this.datatable.xprops.eventbus.$on("edit", item => {
      this.edit(item);
    });
    this.datatable.xprops.eventbus.$on("status", item => {
      this.statusUpdate(item);
    });
    this.datatable.xprops.eventbus.$on("delete", item => {
      this.delete(item);
    });
    this.datatable.xprops.eventbus.$on("statusSelected", item => {
      this.status = item;
      this.getAllSurveys();
    });
    this.datatable.xprops.eventbus.$on("categorySelected", item => {
      this.category = item;
      this.getAllSurveys();
    });
    this.datatable.xprops.eventbus.$on("yearSelected", item => {
      this.year = item;
      this.getAllSurveys();
    });
    this.datatable.xprops.eventbus.$on("monthSelected", item => {
      this.month = item;
      this.getAllSurveys();
    });
    this.$store.dispatch("definition/getAllSubjects").then(subjects => {
      this.subjectOptions = this._.map(subjects.set, item => {
        return {
          id: item.id,
          label: item.title
        };
      });
    });
  },
  computed: {
    ...mapState("definition", {
      _normalSurveys: state => state.normalSurveys
    }),
    normalSurveys: function() {
      return this._.cloneDeep(this._normalSurveys);
    }
  },
  methods: {
    fakeVote(item) {
      this.$store
        .dispatch("definition/fakeVote", { id: item.id })
        .then(response => {
          this.notify("Updated successfully.", "success");
          this.getAllSpecialSurvey();
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
                  this.notify("Survey Deleted.", "success");
                  this.$modal.hide("dialog");
                  this.getAllSurveys();
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
      let newChoices = this.choices.reduce(
        (accumulator, currentValue, currentIndex) => {
          if (currentIndex !== index) {
            accumulator.push(currentValue);
          }
          return accumulator;
        },
        []
      );
      this.choices = newChoices;
    },
    statusUpdate(item) {
      this.$store
        .dispatch("definition/updateSurveyStatus", {
          id: item.id,
          status: item.status
        })
        .then(response => {
          this.notify("Updated successfully.", "success");
          this.getAllSurveys();
        });
    },
    getAllSurveys() {
      let query = this.datatable.query;
      let filter = {
        sort: query.sort,
        order: query.order,
        limit: query.limit,
        offset: query.offset,
        year: this.year,
        month: this.month,
        status: 1,
        category: this.category
      };
      this.datatable.data = [];
      this.$store
        .dispatch("definition/getAllSurveys", { filter: filter })
        .then(response => {
          this.loading = false;
          this.datatable.data = this.normalSurveys;
        });
    }
  }
};
</script>
<style>
</style>
