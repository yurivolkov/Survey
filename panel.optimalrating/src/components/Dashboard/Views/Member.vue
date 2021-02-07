<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-8">
          <h4 class="mb-4 mt-2">User List</h4>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <card>
                <div class="filter-object col-12">
                  <div class="filter-box col-6 float-left">
                    <div class="filter-email col-12 mb-1">
                      <label
                        class="col-3 col-form-label p-0 float-left"
                      >{{$t('common.user.input.email')}} :</label>
                      <div class="col-8 p-0 float-left">
                        <input
                          type="text"
                          class="form-control"
                          v-model="datatable.query.keyword"
                          @keyup="getAllUsers"
                        />
                      </div>
                      <div class="clearfix"></div>
                    </div>
                    <div class="filter-country-or-city col-12">
                      <label
                        class="col-3 col-form-label p-0 float-left"
                        v-if="roles && roles !== 'country_admin'"
                      >{{$t('common.user.input.country')}} :</label>
                      <!-- <label
                        class="col-3 col-form-label p-0 float-left"
                        v-else
                      >{{$t('common.user.input.city')}} :</label> -->

                      <div
                        class="form-inline col-md-8 float-left p-0"
                        v-if="roles &&  roles !== 'country_admin'"
                      >
                        <treeselect
                          id="country"
                          v-model="filteredCountry"
                          :options="this.countries"
                          placeholder="Country"
                          valueFormat="id"
                        />
                      </div>
                      <!-- <div class="form-inline col-md-8 float-left p-0" v-else>
                        <treeselect
                          id="city"
                          v-model="filteredCity"
                          :options="this.cities"
                          placeholder="City"
                          valueFormat="id"
                        />
                      </div> -->
                    </div>

                    <div
                      class="filter-country-or-city col-12 mt-1"
                      v-if="roles && roles !== 'country_admin'"
                    >
                      <!-- <label
                        class="col-3 col-form-label p-0 float-left"
                        v-if="roles &&  roles !== 'country_admin'"
                      >{{$t('common.user.input.city')}} :</label> -->
                      <!-- <div class="form-inline col-md-8 float-left p-0">
                        <treeselect
                          id="city"
                          v-model="filteredCity"
                          :options="this.cities"
                          placeholder="City"
                          valueFormat="id"
                        />
                      </div> -->
                    </div>
                  </div>
                  <div class="col-6 float-right">
                    <div class="filter-box col-4 float-left">
                      <div class="filter-title font-weight-bold">STATUS</div>
                      <div class="filter-item">
                        <div class="filter-input-item">
                          <input
                            id="statusApproved"
                            value="approved"
                            type="checkbox"
                            v-model="userStatus"
                            @change="getAllUsers"
                          />
                          <label for="statusApproved">Approved</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="statusDisApproved"
                            value="disapproved"
                            type="checkbox"
                            v-model="userStatus"
                            @change="getAllUsers"
                          />
                          <label for="statusDisApproved">Disapproved</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="statusPending"
                            value="pending"
                            type="checkbox"
                            v-model="userStatus"
                            @change="getAllUsers"
                          />
                          <label for="statusPending">Pending</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="statusBusiness"
                            value="business"
                            type="checkbox"
                            v-model="userStatus"
                            @change="getAllUsers"
                          />
                          <label for="statusBusiness">Business</label>
                        </div>
                      </div>
                    </div>
                    <div class="filter-box col-4 float-left">
                      <div class="filter-title font-weight-bold">GENDER</div>
                      <div class="filter-item">
                        <div class="filter-input-item">
                          <input
                            id="female"
                            value="female"
                            type="checkbox"
                            v-model="userGender"
                            @change="getAllUsers"
                          />
                          <label for="female">Female</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="male"
                            value="male"
                            type="checkbox"
                            v-model="userGender"
                            @change="getAllUsers"
                          />
                          <label for="male">Male</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="no"
                            value="male"
                            type="checkbox"
                            v-model="userGender"
                            @change="getAllUsers"
                          />
                          <label for="no">No Response</label>
                        </div>
                      </div>
                    </div>
                    <div class="filter-box col-4 float-left">
                      <div class="filter-title font-weight-bold">EDUCATION</div>
                      <div class="filter-item">
                        <div class="filter-input-item">
                          <input
                            id="university"
                            value="university"
                            type="checkbox"
                            v-model="userEducation"
                            @change="getAllUsers"
                          />
                          <label for="university">University</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="high_school"
                            value="high_school"
                            type="checkbox"
                            v-model="userEducation"
                            @change="getAllUsers"
                          />
                          <label for="high_school">High School</label>
                        </div>
                        <div class="filter-input-item">
                          <input
                            id="school"
                            value="school"
                            type="checkbox"
                            v-model="userEducation"
                            @change="getAllUsers"
                          />
                          <label for="school">School</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="clearfix"></div>
                  <div class="col-6 float-right mt-2 p-1" style="border-top: 1px solid #ebebeb">
                    <div class="filter-email col-12 mb-1">
                      <label
                        class="col-12 col-form-label p-0 float-left text-center font-weight-bold"
                      >Birthdate</label>
                      <div class="col-5 p-0 float-left">
                        <label
                          class="col-12 col-form-label p-0 float-left text-center font-weight-bold"
                        >From Date</label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="datatable.query.birthdate.from_date"
                          @keyup="getAllUsers"
                        />
                      </div>
                      <div class="col-5 p-0 float-right">
                        <label
                          class="col-12 col-form-label p-0 float-left text-center font-weight-bold"
                        >Until Date</label>

                        <input
                          type="date"
                          class="form-control"
                          v-model="datatable.query.birthdate.until_date"
                          @keyup="getAllUsers"
                        />
                      </div>
                      <div class="clearfix"></div>
                    </div>
                  </div>
                </div>
              </card>
            </div>
          </div>
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
      <div class="row" v-if="datatableF.data.length > 0">
        <div class="col-12">
          <div class="row">
            <div class="col-8">
              <h4 class="mb-4 mt-2">Waiting for Approval List</h4>
            </div>
            <div class="col-12">
              <card>
                <datatable
                  :class="{'loading-table': loading}"
                  v-if="datatableF.data"
                  v-bind="datatableF"
                />
              </card>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="datatableTrash.data.length > 0 && roles && roles !== 'country_admin'">
        <div class="col-12">
          <div class="row">
            <div class="col-8">
              <h4 class="mb-4 mt-2">Trash User List</h4>
            </div>
            <div class="col-12">
              <card>
                <datatable
                  :class="{'loading-table': loading}"
                  v-if="datatableTrash.data"
                  v-bind="datatableTrash"
                />
              </card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal name="approve-modal" height="auto" :draggable="true" :classes="['v--modal', 'm-modal']">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('approve-modal')"
              ></i>
              <h4 class="mt-0">{{$t('common.user.labels.edit')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <div class="col-6">
                    <h3>Portrait Image</h3>
                    <img :src="base_url+'/cdn/images/user_portrait/'+user.portrait_image" alt />
                  </div>
                  <div class="col-6">
                    <h3>Nationality Image</h3>
                    <img :src="base_url+'/cdn/images/user_nationality/'+user.national_image" alt />
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
          @click="$modal.hide('status-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveStatus"
          :disabled="saving"
        >{{saving ? 'Approving...' : 'Approve Profile'}}</button>
      </div>
    </modal>
    <modal name="status-modal" height="auto" :draggable="true" :classes="['v--modal', 'm-modal']">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('status-modal')"
              ></i>
              <h4 class="mt-0">{{$t('common.user.labels.edit')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.user.input.status')}} :</label>
                  <div class="col-8">
                    <treeselect
                      v-model="selectedStatus"
                      :options="optionsStatus"
                      placeholder="Country"
                      valueFormat="id"
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
          @click="$modal.hide('status-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveUser"
        >{{saving?'Saving...':$t('common.buttons.save')}}</button>
      </div>
    </modal>
    <modal name="user-modal" height="auto" :draggable="true" :classes="['v--modal', 'm-modal']">
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <i
                class="fas fa-times fa-2x btn-modal-close text-success"
                slot="top-right"
                @click="$modal.hide('user-modal')"
              ></i>
              <h4 class="mt-0">{{$t('common.user.labels.edit')}}</h4>
              <hr />
              <form @submit.prevent="$emit('submitAction', item)">
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.user.input.name')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="user.firstname" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.user.input.email')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="user.email" />
                  </div>
                </div>
                <div class="form-group row" v-if="roles ==='super_admin'">
                  <label class="col-4 col-form-label">{{$t('common.user.input.country')}} :</label>
                  <div class="col-8">
                    <treeselect
                      v-model="selectedCountry"
                      :options="this.countries"
                      placeholder="Country"
                      valueFormat="id"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.user.input.status')}} :</label>
                  <div class="col-8">
                    <treeselect
                      v-model="selectedStatus"
                      :options="optionsStatus"
                      placeholder="Country"
                      valueFormat="id"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.user.input.created_at')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="user.created_at" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-4 col-form-label">{{$t('common.user.input.updated_at')}} :</label>
                  <div class="col-8">
                    <input type="text" class="form-control" v-model="user.updated_at" />
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
          @click="$modal.hide('user-modal')"
        >{{$t('common.close')}}</button>
        <button
          type="button"
          class="btn btn-primary btn-sm btn-round btn-fill px-4"
          @click="saveUser"
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
import TableActions from "src/components/Dashboard/Views/Member/TableActions.vue";
import TableSeenActions from "src/components/Dashboard/Views/Member/TableSeenActions.vue";
import TableTrashActions from "src/components/Dashboard/Views/Member/TableTrashActions.vue";
import { mapState, mapGetters } from "vuex";
import { User } from "src/models/definition";

export default {
  components: {
    Card,
    TableActions,
    TableCustomColumn,
    TableTrashActions,
    TableSeenActions
  },
  props: ["row", "xprops", "nested"],
  data() {
    return {
      saving: false,
      loading: false,
      base_url: "http://server.optimalrating.com/cdn/",
      user: new User(),
      selectedCountry: null,
      selectedStatus: null,
      filteredCountry: null,
      filteredCity: null,
      mode: "save",
      userStatus: [],
      userGender: [],
      userEducation: [],
      optionsStatus: [
        {
          id: "approved",
          label: "Approved"
        },
        {
          id: "disApproved",
          label: "Disapproved"
        },
        {
          id: "pending",
          label: "Pending"
        },
        {
          id: "freeze",
          label: "Freeze"
        }
      ],
      datatable: {
        columns: [
          { title: "ID", field: "id", sortable: true },
          { title: "Name", field: "firstname", tdComp: TableCustomColumn },
          { title: "Surname", field: "lastname", tdComp: TableCustomColumn },
          {
            title: "Gender",
            field: "user_details.gender",
            tdComp: TableCustomColumn
          },
          {
            title: "Birthdate",
            field: "user_details.birthdate",
            tdComp: TableCustomColumn
          },
          { title: "city", field: "country.name", tdComp: TableCustomColumn },
          {
            title: "status",
            field: "status",
            sortable: true,
            tdComp: TableCustomColumn
          },
          {
            tdComp: TableActions,
            visible: "true",
            thStyle: { width: "20%" },
            tdStyle: { width: "20%" }
          }
        ],
        data: [],
        total: 0,
        query: {
          sort: "id",
          order: "asc",
          keyword: "",
          country: "",
          city: "",
          birthdate: { from_date: null, until_date: null }
        },
        selection: this.selection ? [] : null,
        HeaderSettings: false,
        supportNested: true,
        supportBackup: true,
        xprops: {
          eventbus: new Vue()
        }
      },
      datatableF: {
        columns: [
          { title: "Name", field: "firstname", tdComp: TableCustomColumn },
          { title: "Surname", field: "lastname", tdComp: TableCustomColumn },
          {
            title: "Gender",
            field: "user_details.gender",
            tdComp: TableCustomColumn
          },
          {
            title: "Birthdate",
            field: "user_details.birthdate",
            tdComp: TableCustomColumn
          },
          { title: "city", field: "country.name", tdComp: TableCustomColumn },
          { title: "status", field: "status", tdComp: TableCustomColumn },
          {
            tdComp: TableSeenActions,
            visible: "true",
            thStyle: { width: "10%" },
            tdStyle: { width: "10%" }
          }
        ],
        pagination: false,
        data: [],
        total: 0,
        query: { sort: "id", order: "asc", keyword: "", country: "", city: "" },
        selection: this.selection ? [] : null,
        HeaderSettings: false,
        supportNested: true,
        supportBackup: true,
        xprops: {
          eventbus: new Vue()
        }
      },
      datatableTrash: {
        columns: [
          { title: "Name", field: "firstname", tdComp: TableCustomColumn },
          { title: "Surname", field: "lastname", tdComp: TableCustomColumn },
          {
            title: "Gender",
            field: "user_details.gender",
            tdComp: TableCustomColumn
          },
          {
            title: "Birthdate",
            field: "user_details.birthdate",
            tdComp: TableCustomColumn
          },
          { title: "city", field: "country.name", tdComp: TableCustomColumn },
          { title: "status", field: "status", tdComp: TableCustomColumn },
          {
            tdComp: TableTrashActions,
            visible: "true",
            thStyle: { width: "10%" },
            tdStyle: { width: "10%" }
          }
        ],
        pagination: false,
        data: [],
        total: 0,
        query: {
          sort: "id",
          order: "asc",
          keyword: null,
          country: null,
          city: null
        },
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
  watch: {
    "datatable.query": {
      handler(query) {
        this.getAllUsers();
      },
      deep: true
    },
    selectedCountry: function(val) {
      if (typeof val == "undefined" || null === val) {
        this.user.country_id = null;
      } else {
        this.user.country_id = val;
      }
    },
    selectedStatus: function(val) {
      if (typeof val == "undefined" || null === val) {
        this.user.status = "pending";
      } else {
        this.user.status = val;
      }
    },
    filteredCountry: function(val) {
      if (typeof val == "undefined" || null === val) {
        this.datatable.query.country = null;
      } else {
        this.datatable.query.country = val;
      }
    },
    filteredCity: function(val) {
      if (typeof val == "undefined" || null === val) {
        this.datatable.query.city = null;
      } else {
        this.datatable.query.city = val;
      }
    }
  },
  computed: {
    ...mapState("definition", {
      _users: state => state.users,
      _countries: state => state.countries,
      _cities: state => state.cities
    }),
    ...mapState("account", {
      _auth_country: state => state.country
    }),
    ...mapState("auth", {
      roles: state => state.roles
    }),
    countries: function() {
      return this._.map(this._countries, item => {
        let obj = {
          id: item.id,
          label: item.name || ""
        };
        return obj;
      });
    },
    cities: function() {
      return this._.map(this._cities, item => {
        let obj = {
          id: item.id,
          label: item.name || ""
        };
        return obj;
      });
    },
    users: function() {
      return this._.cloneDeep(this._users);
    },

    auth_country: function() {
      return this._.cloneDeep(this._auth_country);
    }
  },
  created() {
    this.datatable.xprops.eventbus.$on("edit", item => {
      this.edit(item);
    });
    this.datatable.xprops.eventbus.$on("delete", item => {
   /*   if (this.roles !== "country_admin") {
        this.trashUser(item, "deleted");
        this.getAllUsers();
        this.getAllTrashUsers();
        return;
      }*/
      this.delete(item);
    });
    this.datatable.xprops.eventbus.$on("status", item => {
      this.statusModal(item);
    });
    this.datatable.xprops.eventbus.$on("lookUser", item => {
      this.$router.push({
        name: "admin.members.detail",
        params: { username: item.username }
      });
    });
    this.datatableF.xprops.eventbus.$on("lookUser", item => {
      this.$router.push({
        name: "admin.members.detail",
        params: { username: item.username }
      });
    });
    this.datatableTrash.xprops.eventbus.$on("lookUser", item => {
      this.$router.push({
        name: "admin.members.detail",
        params: { username: item.username }
      });
    });
    this.datatableTrash.xprops.eventbus.$on("undoUser", item => {
      this.trashUser(item, "approved");
      this.getAllTrashUsers();
    });
    this.getAllCities();
    this.getAllPendingFreezeUsers();
    this.getAllTrashUsers();
    this.$store.dispatch("definition/getAllCountries");
  },
  methods: {
    saveStatus() {
      this.saving = true;
      this.$store
        .dispatch("definition/upgradeUser", {
          id: this.user.id,
          data: { is_real: 1 }
        })
        .then(response => {
          this.saving = false;
          this.getAllPendingFreezeUsers();
          this.getAllUsers();
          this.$modal.hide("approve-modal");
          this.notify(this.$t(response.message), "success");
        })
        .catch(error => {
          this.saving = false;
          this.notify(this.$t(response.message), "err");
        });
    },
    getAllUsers() {
      let query = this.datatable.query;

      let filter = {
        sort: query.sort,
        order: query.order,
        limit: query.limit,
        offset: query.offset,
        keyword: query.keyword,
        userStatus:
          this.userStatus.length > 0
            ? this.userStatus
            : ["pending", "approved", "disapproved", "business"],
        userEducation: this.userEducation,
        userGender: this.userGender,
        country: query.country,
        city: query.city,
        birthdate: query.birthdate
      };
      this.$store
        .dispatch("definition/getAllUsers", { filter: filter })
        .then(response => {
          this.loading = false;
          this.datatable.total =
            response.pagination && response.pagination.recordCount
              ? response.pagination.recordCount
              : 1;
          this.datatable.data = response.set;
        });
    },
    getAllPendingFreezeUsers() {
      let query = this.datatableF.query;

      let filter = {
        sort: "id",
        order: "asc",
        limit: 100,
        offset: 0,
        userStatus: ["pendingFreeze", "pendingApproved"]
      };
      this.$store
        .dispatch("definition/getAllUsers", { filter: filter })
        .then(response => {
          this.loading = false;
          this.datatableF.total =
            response.pagination && response.pagination.recordCount
              ? response.pagination.recordCount
              : 1;
          this.datatableF.data = response.set;
        });
    },
    getAllTrashUsers() {
      let query = this.datatableTrash.query;

      let filter = {
        sort: "id",
        order: "asc",
        limit: 100,
        offset: 0,
        userStatus: ["deleted"]
      };
      this.$store
        .dispatch("definition/getAllUsers", { filter: filter })
        .then(response => {
          this.loading = false;
          this.datatableTrash.total =
            response.pagination && response.pagination.recordCount
              ? response.pagination.recordCount
              : 1;
          this.datatableTrash.data = response.set;
        });
    },
    statusModal(item) {
      this.mode = "edit";
      this.user = item;
      this.selectedStatus = [item.status];
      this.selectedCountry = item.country_id ? item.country_id : null;
      this.$modal.show("status-modal");
    },
    statusLookModal(item) {
      this.mode = "edit";
      this.user = item;
      this.selectedStatus = [item.status];
      this.$modal.show("approve-modal");
    },
    edit(item) {
      this.mode = "edit";
      this.user = item;
      this.selectedStatus = [item.status];
      this.selectedCountry = item.country_id ? item.country_id : null;
      this.$modal.show("user-modal");
    },
    delete(item) {
      this.$modal.show("dialog", {
        title: "Warning!!",
        text: `Do you really want to delete this member?`,
        buttons: [
          {
            title: "Cancel"
          },
          {
            title: "Yes",
            class: "btn btn-danger btn-fill",
            handler: () => {
              this.$store
                .dispatch("definition/deleteUser", { data: item })
                .then(() => {
                  this.notify("User Deleted.", "success");
                  this.$modal.hide("dialog");
                  this.getAllUsers();
                });
            }
          }
        ]
      });
    },
    saveUser() {
      this.saving = true;
      if (this.mode === "save") {
        this.$store
          .dispatch("definition/saveUser", { data: this.user })
          .then(response => {
            this.saving = false;
            this.getAllUsers();
            this.$modal.hide("user-modal");
            this.$modal.hide("status-modal");
            this.notify(this.$t(response.message), "success");
          })
          .catch(error => {
            this.saving = false;
            this.notify(this.$t(response.message), "err");
          });
      } else {
        this.$store
          .dispatch("definition/updateUser", { data: this.user })
          .then(response => {
            this.saving = false;
            if (response.code === 200) {
              this.getAllUsers();
              this.$modal.hide("user-modal");
              this.$modal.hide("status-modal");
              this.notify(this.$t(response.message), "success");
            }
          })
          .catch(error => {
            this.saving = false;
            this.notify(this.$t(response.message), "err");
          });
      }
    },
    getAllCities() {
      let query = this.datatable.query;
      if (query.sort == "name") {
        query.sort = `${query.sort}.${this.$store.getters["account/getActiveLanguage"].code}`;
      }

      let filter = {
        sort: query.sort,
        order: query.order,
        limit: 1000,
        offset: 0
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
    async trashUser(item, status) {
      this.mode = "edit";
      item.status = status;
      this.user = item;
      this.getAllTrashUsers();
      await this.saveUser();
    }
  }
};
</script>

<style lang="css">
.form-control {
  line-height: normal !important;
}
</style>
