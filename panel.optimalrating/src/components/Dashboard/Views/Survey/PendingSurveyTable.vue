<template>
  <div class>
    <h4 :class="`mb-4 mt-2 ${hideFilter ? 'text-danger' : ''}`">
      {{title}}
      <i
        @click="collapsed = !collapsed"
        :class="`fa fa-caret-${collapsed ? 'right' : 'down'}`"
        style="color: #333; cursor: pointer; margin-left: 10px;"
      />
    </h4>
    <div v-if="!collapsed" class="row">
      <div class="col-12">
        <card>
          <datatable :class="{'loading-table': loading}" v-if="datatable.data" v-bind="datatable" />
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "src/components/UIComponents/Cards/Card.vue";
import { mapState } from "vuex";
export default {
  props: ["title", "loading", "datatable", "hideFilter"],
  components: {
    Card
  },
  data() {
    return {
      collapsed: false,
      years: [
        { id: "2019", label: "2019" },
        { id: "2020", label: "2020" }
      ],
      months: [],
      statuses: [
        { id: 1, label: "active" },
        { id: 0, label: "pending" }
      ],
      month: null,
      yearSelected: null,
      monthSelected: null,
      statusSelected: null,
      monthsArray: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      categorySelected: null,
      categories: []
    };
  },
  computed: {
    ...mapState("definition", {
      _categories: state => state.categories
    })
  },
  watch: {
    yearSelected: function(val) {
      if (typeof val == "undefined" || null === val) {
        // console.log(val)
      } else {
        this.datatable.xprops.eventbus.$emit("yearSelected", val);
      }
    },
    monthSelected: function(val) {
      if (typeof val == "undefined" || null === val) {
      } else {
        this.datatable.xprops.eventbus.$emit("monthSelected", val);
      }
    },
    statusSelected: function(val) {
      if (typeof val == "undefined" || null === val) {
      } else {
        this.datatable.xprops.eventbus.$emit("statusSelected", val);
      }
    },
    categorySelected: function(val) {
      if (typeof val == "undefined" || null === val) {
      } else {
        this.datatable.xprops.eventbus.$emit("categorySelected", val);
      }
    }
  },
  created() {
    this.months.push(
      this._.map(this.monthsArray, (month, index) => {
        return {
          id: index + 1,
          label: month
        };
      })
    );
    this._categories.map(category => {
      this.categories.push({
        id: category.id,
        label: category.name
      });
    });
  },
  methods: {
    openModal(modal) {
      this.datatable.xprops.eventbus.$emit("openModal");
    }
  }
};
</script>
