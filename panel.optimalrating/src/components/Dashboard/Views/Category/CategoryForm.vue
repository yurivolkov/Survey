<template>
  <form @submit.prevent="$emit('submitAction', item)">
    <div class="form-group row">
      <label class="col-4 col-form-label">{{$t('common.category.input.name')}} :</label>
      <div class="col-8">
        <input type="text" class="form-control" v-model="item.name" :disabled="countryDisabled" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-4 col-form-label">{{$t('common.category.input.code')}} :</label>
      <div class="col-8">
        <input type="text" class="form-control" v-model="item.code" :disabled="countryDisabled" />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-4 col-form-label">{{$t('common.category.input.sort_order')}} :</label>
      <div class="col-8">
        <input
          type="number"
          class="form-control"
          v-model="item.sort_order"
          :disabled="countryDisabled"
        />
      </div>
    </div>
    <div class="form-group row" v-show="isAdmin()">
      <label class="col-4 col-form-label">{{$t('common.category.input.parent')}} :</label>
      <div class="col-8">
        <treeselect
          v-model="selectedParent"
          :options="categoryOptions"
          placeholder="Üst Kategori"
          valueFormat="id"
          :disabled="countryDisabled"
        />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-4 col-form-label">{{$t('common.category.input.status')}} :</label>
      <div class="col-8">
        <div class="mt-2">
          <switches
            v-model="selectedStatus"
            :text-enabled="$t('common.buttons.active')"
            :text-disabled="$t('common.buttons.passive')"
            :disabled="countryDisabled"
          ></switches>
        </div>
      </div>
    </div>
    <hr />
    <div v-if="item && item.user">
      <div :class="rowClass">
        <h4>{{$t('common.category.detail_modal.user_detail')}}</h4>
      </div>
      <div :class="rowClass">
        <div :class="childColFirstClass">
          <b>{{$t('common.user.input.name')}} :</b>
        </div>
        <div
          :class="childColSecondClass"
        >{{item && item.user ? item.user.firstname + ' '+ item.user.lastname : ''}}</div>
      </div>
      <div :class="rowClass">
        <div :class="childColFirstClass">
          <b>{{$t('common.user.input.email')}} :</b>
        </div>
        <div :class="childColSecondClass">{{item.user.email}}</div>
      </div>
      <div :class="rowClass">
        <div :class="colFirstClass">
          <b>{{$t('common.category.detail_modal.created_date')}} :</b>
        </div>
        <div
          :class="colSecondClass"
        >{{item.parent && item.parent.created_at ? getDate(item.parent.created_at) : ''}}</div>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col d-flex">
        <button
          type="button"
          name="button"
          :disabled="countryDisabled"
          class="btn btn-danger btn-sm btn-fill btn-round px-4"
          @click.prevent="$emit('remove')"
          v-if="item.id"
        >{{$t('common.buttons.delete')}}</button>
        <button
          :disabled="saving || countryDisabled"
          type="button"
          class="btn btn-primary btn-sm btn-fill btn-round w-25 ml-auto"
          @click.prevent="$emit('save')"
        >{{saving ? 'Saving...' : $t('common.buttons.save')}}</button>
      </div>
    </div>
  </form>
</template>
<script>
import { mapState } from "vuex";
import MultiLangInput from "src/components/UIComponents/Inputs/MultiLangInput.vue";

export default {
  components: {
    MultiLangInput
  },
  props: ["item", "whichForm", "saving", "nodisable"],
  data() {
    return {
      cdnUrl: process.env.CDN_LOCATION,
      imageUrl: `${this.item.cover}`,
      loading: false,
      uploadedImage: null,
      brand: null,
      selectedParent: 0,
      selectedStatus: this.item.status == "active" ? true : false,
      colFirstClass: "col ",
      colSecondClass: "col-9 ",
      childColFirstClass: "col",
      childColSecondClass: "col-9",
      rowClass: "row pl-3 pr-3 pb-3"
    };
  },
  watch: {
    item: function() {
      this.selectedParent = this.item.parent ? parseInt(this.item.parent) : 0;
      this.selectedStatus = this.item.status == "active" ? true : false;
    },
    selectedParent: function(val) {
      this.item.parent = parseInt(val);
    },
    selectedStatus: function() {
      this.item.status = this.selectedStatus ? "active" : "passive";
    }
  },
  created() {
    if (this.item.parent && this.item.parent.id) {
      this.selectedParent = this.item.parent ? parseInt(this.item.parent) : 0;
      this.selectedStatus = this.item.status == "active" ? true : false;
    }
  },
  computed: {
    ...mapState("definition", {
      categories: state => state.categories
    }),
    ...mapState("auth", {
      roles: state => state.roles
    }),
    countryDisabled: function() {
      return this.roles === "country_admin" && this.selectedParent === 0 && this.nodisable !== true;
    },
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
    getDate(date) {
      const dates = date.split(":");
      return `${dates[0]}:${dates[1]}`;
    },
    isAdmin() {
      return this.$store.state.auth.roles[0].name === "admin" ? false : true;
    }
  }
};
</script>
