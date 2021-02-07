<template>
  <div class="CategorySurvey">
    <h3 style="font-weight: bold">Categories</h3>
    <!-- <NewCategory /> -->
    <Category v-for="category in categories" :key="category.id" :data="category" />
  </div>
</template>
<script>
import Category from "./SurveyApproval/Category";
import NewCategory from "./SurveyApproval/NewCategory";
export default {
  name: "CategorySurvey",
  components: {
    Category,
    NewCategory
  },
  data() {
    return {
      surveys: [],
      categories: [],
      newData: {}
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      (this.categories = []), (this.surveys = []);
      this.$store.dispatch("definition/getAllCategoryTree").then(response => {
        this.$store.dispatch("definition/getAllSurveys").then(res => {
          console.log(res, response);
          response = response.map(x => {
            return {
              ...x,
              children: x.children
                ? x.children.map(y => {
                    let surveys = res.set.filter(
                      x => x.category_id === y.id.toString()
                    );
                    return { ...y, surveys };
                  })
                : []
            };
          });
          this.categories = response;
        });
      });
    },
    addNew() {}
  }
};
</script>
<style>
.CategorySurvey {
  padding: 40px;
  max-width: 600px;
}
.CategorySurvey .vue-js-switch {
  margin-bottom: 0 !important;
}
.CategorySurvey .fa-pencil-square-o {
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
}
.CategorySurvey .fa-trash {
  cursor: pointer;
}
.CategorySurvey .Category {
  padding: 10px;
  font-size: 14px;
  background-color: #fff;
}
.CategorySurvey .CategoryText {
  cursor: pointer;
}
.CategorySurvey .Category:nth-child(2n + 1) {
  background-color: #f5f3f3;
}
.CategorySurvey .Category .SubCategories {
  padding-top: 10px;
}
.SubCategory {
  padding: 10px 0 10px 30px;
}
.Survey {
  padding: 10px 0 10px 40px;
}
</style>