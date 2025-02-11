<script setup>
import BookmarkList from "../components/BookmarkList.vue";
import bookmarksData from "../data/bookmarks.json";

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
    storagePrefix="business"
    :isDarkMode="isDarkMode"
  />
</template>
