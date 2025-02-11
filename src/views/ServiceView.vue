<script setup>
import BookmarkList from "../components/BookmarkList.vue";
import bookmarksData from "../data/service.json";
defineProps({
  isDarkMode: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <BookmarkList
    :bookmarksData="bookmarksData.categories"
    storagePrefix="service"
    :isDarkMode="isDarkMode"
  />
</template>
