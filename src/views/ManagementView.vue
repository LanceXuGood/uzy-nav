<script setup>
import BookmarkList from "../components/BookmarkList.vue";
import managementData from "../data/management.json";
defineProps({
  isDarkMode: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <BookmarkList
    :bookmarksData="managementData.categories"
    storagePrefix="management"
  />
</template>
