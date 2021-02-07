<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12 mt-4">
        <h4
          class="mb-4 mt-2 text-dark border-left border-warning pl-2"
        >{{$t('common.survey.components.edit')}}</h4>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-12" v-if="isLoading">
            <form @submit.prevent="update">
              <div class="col-12 float-left">
                <div class="col-10 float-left">
                  <div class="form-group row">
                    <label class="col-2 col-form-label">Added By :</label>
                    <div class="col-10">
                      <h5
                        v-if="addedUser"
                      >{{ addedUser.firstname}} {{ addedUser.middlename }} {{ addedUser.lastname }} / {{ addedUser.username }}</h5>
                      <h5 v-else>-</h5>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-3 col-form-label">Survey Title :</label>
                    <div class="col-8">
                      <input type="text" class="form-control" v-model="survey.title" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-3 col-form-label">Survey Url :</label>
                    <div class="col-8">
                      <input type="text" class="form-control" v-model="survey.slug" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-3 col-form-label">Survey Category :</label>
                    <div class="col-8">
                      <treeselect
                        v-model="selectedCategory"
                        :options="categoryOptions"
                        placeholder="Üst Kategori"
                        valueFormat="id"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-3 col-form-label">Survey Description :</label>
                    <div class="col-8">
                      <vue-editor :editorToolbar="customToolbar" v-model="survey.description"></vue-editor>
                    </div>
                  </div>
                </div>
                <div class="col-2 float-right overflow-hidden profileImage">
                  <img
                    v-if="addedUser"
                    class="preview"
                    :src="cdnUrl + userImageUrl + addedUser.user_details.profile_image "
                  />
                </div>
              </div>
              <div class="clearfix"></div>
              <hr />
              <h4>Choices</h4>
              <div class="form-group row mb-5" v-for="(choice, index) in survey.choices">
                <div class="col-7 pt-3">
                  <input type="text" class="form-control" v-model="choice.choice_title" />
                </div>
                <div class="col-1">
                  <image-field
                    @upload="uploading = $event"
                    :imageName="choice.choice_image"
                    :path="choice_path"
                    :imageId="choice.id"
                    @change="onImage($event, index)"
                  ></image-field>
                </div>
                <div class="col-1">
                  <i class="fa nc-fav-remove"></i>
                  <button
                    class="btn btn-danger btn-sm"
                    type="button"
                    @click="deleteChoice(choice.id)"
                  >
                    <i class="far fa-trash-alt"></i>
                  </button>
                </div>
                <div class="col-1 pt-2">
                  Status
                  <toggle-button
                    color="#82C7EB"
                    :sync="true"
                    :height="20"
                    :width="40"
                    :value="choice.status === '1' ? true : false"
                    @change="changeStatus(index, choice, $event)"
                  />
                </div>
                <div class="col-7">
                  <vue-editor :editorToolbar="customToolbar" v-model="choice.choice_description"></vue-editor>
                </div>
              </div>
              <div class="form-group">
                <button
                  type="submit"
                  class="btn btn-primary pull-right mt-2"
                >{{saving ? 'Updating...' : uploading ? 'Uploading' : 'Update'}}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import TableCustomColumn from "src/components/UIComponents/DataTable/TableCustomColumn";
import TableStatus from "src/components/UIComponents/DataTable/TableStatus";
import DateMonthColumn from "src/components/UIComponents/DataTable/DateMonthColumn";
import DataTable from "src/components/Dashboard/Views/Survey/SurveyDataTable";
import ImageField from "src/components/Dashboard/Views/Survey/ImageField";
import { Survey } from "src/models/definition";
import { mapState, mapGetters } from "vuex";

import { VueEditor } from "vue2-editor";

export default {
  components: {
    TableCustomColumn,
    TableStatus,
    DataTable,
    DateMonthColumn,
    ImageField,
    VueEditor
  },
  data() {
    return {
      uploading: false,
      saving: false,
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }]
      ],
      descToolbar: [["video"]],
      isLoading: false,
      survey: new Survey(),
      mode: "save",
      addedUser: null,
      choices: [],
      category: null,
      choice_path: "cdn/images/choice/",
      cdnUrl: process.env.CDN_LOCATION,
      userImageUrl: `cdn/images/user/`,
      selectedCategory: null
    };
  },
  mounted() {
    this.$store
      .dispatch("definition/getDetailSurvey", { id: this.$route.params.id })
      .then(response => {
        this.survey = response.result.set;
        this.addedUser = response.result.set.user;
        this.selectedCategory = response.result.set.category_id;
        this.isLoading = true;
      });
    this.getCategories(0);
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
    onImage(e, i) {
      this.survey.choices[i].choice_image = e;
    },
    changeStatus(index, choice, e) {
      this.survey.choices[index].status = e.value ? "1" : "0";

      this.$store
        .dispatch("definition/updateChoiceStatus", {
          id: choice.id,
          status: this.survey.choices[index].status
        })
        .then(() => {
          this.saving = false;
          this.notify("Updated successfully.", "success");
        })
        .catch(() => {
          this.survey.choices[index].status = val ? "0" : "1";
          this.notify("Error", "error");
        });
    },
    update() {
      if (!this.saving && !this.uploading) {
        this.saving = true;
        this.$store
          .dispatch("definition/updateSpecialSurvey", { data: this.survey })
          .then(() => {
            this.saving = false;
            this.notify("Updated successfully.", "success");
          })
          .catch(() => (this.saving = false));
      }
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
    deleteChoice(id) {
      this.$store
        .dispatch("definition/destroyChoice", { data: id })
        .then(response => {
          this.choices = response.result.set;
          this.notify("Choice has been deleted", "success");
        });
    }
  },
  watch: {
    selectedCategory: function(val) {
      if (typeof val == "undefined" || null === val) {
        this.survey.category_id = null;
      }
    }
  }
};
</script>
<style scoped>
.border-warning {
  border-width: 3px !important;
}
.choice_image {
  width: 100%;
}
.profileImage {
  height: 100px;
  width: 200px;
  border-radius: 200px;
  margin-top: 40px;
}
.profileImage img {
  height: 100px;
  border-radius: 50px;
}
</style>
