<template>
  <div class="category-tree">
    <ul class="tree-view">
      <category-tree-item
        v-for="item in items"
        :item="item"
        :key="item.id"
        :bus="bus"
        :depth="0">
      </category-tree-item>
    </ul>

  </div>
</template>

<script>
import CategoryTreeItem from 'src/components/Dashboard/Views/Category/CategoryTreeItem'
export default {
  props: ['items', 'bus'],
  components: {
    CategoryTreeItem
  }
}
</script>

<style lang="css">
</style>
