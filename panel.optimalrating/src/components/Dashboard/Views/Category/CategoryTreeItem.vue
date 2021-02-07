<template>
  <li>
    <div
            :class="[isActive ? 'active' : '']"
            :style="indent"
            @click.self="selectItem">
      <span v-if="isFolder" @click="toggle">
        <i class="fas fa-lg fa-fw" :class="[open ? 'fa-angle-down' : 'fa-angle-right']"></i>
      </span>

      <span v-else>
        <i class="far fa-lg fa-fw"></i>
      </span>

      <span v-if="isFolder" @click="selectItem">
        <i class="far fa-lg fa-fw" :class="[open ? 'fa-folder-open' : 'fa-folder']"></i>
      </span>

      <span v-else @click="selectItem">
        <i class="far fa-file fa-lg fa-fw"></i>
      </span>

      <span class="name">{{ item.name }} <small v-if="item.name">/ {{ item.code }} </small></span>
      <span class="name pull-right badge" 
            v-bind:class="{ 'badge-success': item.status == 'active', 'badge-danger': item.status == 'passive' }">
            {{ item.status }} </span>

    </div>

    <ul v-show="open" v-if="isFolder">
      <category-tree-item
              class="item"
              v-for="(item, index) in item.children"
              :key="index"
              :item="item"
              :bus="bus"
              :depth="depth + 1"
              @select="bus.$emit('select', item)">
      </category-tree-item>
    </ul>

  </li>
</template>

<script>
  import CategoryTreeItem from 'src/components/Dashboard/Views/Category/CategoryTreeItem'
  import {Category} from "../../../../models/definition";
  export default {
    props: ['item', 'bus', 'depth'],
    name: 'category-tree-item',
    components: {
      CategoryTreeItem
    },
    data: function () {
      return {
        open: false,
        isActive: null
      }
    },
    computed: {
      isFolder: function () {
        return this.item.children &&
                this.item.children.length
      },
      indent() {
        return { 'padding-left': `${this.depth * 10}px` }
      }
    },
    created(){
      let _this = this;
      this.bus.$on('active', function(active){
        _this.isActive = false;
      })
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      selectItem: function() {
        this.bus.$emit('active', false);

        let category = new Category();
        let item = _.merge(category, this.item);
        this.isActive = true;
        this.bus ? this.bus.$emit('select', item) : this.$emit('select', item);
      }
    }
  }
</script>

<style lang="css" scoped>
.pull-right{
  float:right;
}
.badge-success{
  color:green!important
}
</style>
