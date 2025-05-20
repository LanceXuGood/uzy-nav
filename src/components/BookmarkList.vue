<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  bookmarksData: {
    type: Array,
    required: true,
  },
  storagePrefix: {
    type: String,
    required: true,
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
});

const bookmarks = ref(props.bookmarksData);
const favorites = ref([]);
const searchQuery = ref("");
const activeCategory = ref('所有'); // 添加激活分类状态

// 从localStorage加载数据
onMounted(() => {
  const savedFavorites = localStorage.getItem(
    `${props.storagePrefix}Favorites`
  );
  const savedBookmarkOrder = localStorage.getItem(
    `${props.storagePrefix}Order`
  );

  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites);
  }
  if (savedBookmarkOrder) {
    const savedOrder = JSON.parse(savedBookmarkOrder);
    const newBookmarks = [];
    savedOrder.forEach((savedCategory) => {
      const existingCategory = bookmarks.value.find(
        (b) => b.name === savedCategory.name
      );
      if (existingCategory) {
        newBookmarks.push(existingCategory);
      }
    });
    bookmarks.value.forEach((category) => {
      if (!newBookmarks.some((b) => b.name === category.name)) {
        newBookmarks.push(category);
      }
    });
    bookmarks.value = newBookmarks;
  }
});

// 切换收藏状态
const toggleFavorite = (item) => {
  const index = favorites.value.findIndex((fav) => fav.name === item.name);
  if (index === -1) {
    favorites.value.push(item);
  } else {
    favorites.value.splice(index, 1);
  }
  localStorage.setItem(
    `${props.storagePrefix}Favorites`,
    JSON.stringify(favorites.value)
  );
};

// 检查是否已收藏
const isFavorite = (item) => {
  return favorites.value.some((fav) => fav.name === item.name);
};

// 搜索匹配函数
const isMatch = (text, query) => {
  return text.toLowerCase().includes(query);
};

// 获取所有分类列表
const categoryList = computed(() => {
  const categories = ['所有'];
  bookmarks.value.forEach(category => {
    categories.push(category.name);
  });
  return categories;
});

// 根据激活分类过滤书签
const filteredBookmarksByCategory = computed(() => {
  if (activeCategory.value === '所有') {
    return bookmarks.value;
  } else {
    return bookmarks.value.filter(category => 
      category.name === activeCategory.value
    );
  }
});

// 搜索过滤
const filteredBookmarks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  const categoryFiltered = filteredBookmarksByCategory.value;
  
  if (!query) return categoryFiltered;

  return categoryFiltered
    .map((category) => {
      if (isMatch(category.name, query)) {
        return category;
      }
      const filteredItems = category.items.filter((item) =>
        isMatch(item.name, query)
      );
      if (filteredItems.length > 0) {
        return {
          ...category,
          items: filteredItems,
        };
      }
      return null;
    })
    .filter(Boolean);
});

// 获取头像渐变色
const getAvatarGradient = (name, type) => {
  const gradients = {
    a: "#808080",
    b: "#2196F3", // 蓝色
    c: "#FF4D4D", // 红色
    d: "#9C27B0",
    e: "#4CAF50",
    f: "#FF9800",
    g: "linear-gradient(135deg, #2196F3 0%, #FF4D4D 100%)",
    h: "#607D8B",
    i: "#3F51B5",
    j: "#00BCD4",
    k: "#009688",
    l: "#8BC34A",
    m: "#CDDC39",
    n: "#FFC107",
    o: "#FF5722",
    p: "#E91E63",
    q: "#673AB7",
    r: "#03A9F4",
    s: "#009688",
    t: "#4CAF50",
    u: "#8BC34A",
    v: "#FFEB3B",
    w: "#FF9800",
    x: "#795548",
    y: "#9E9E9E",
    z: "#B71C1C",
  };

  // 如果提供了type，优先使用type的颜色
  if (type && gradients[type.toLowerCase()]) {
    return gradients[type.toLowerCase()];
  }

  // 否则使用名称首字母
  const firstChar = name.charAt(0).toLowerCase();
  if (!/[a-z]/.test(firstChar)) {
    return "linear-gradient(135deg, #808080 0%, #666666 100%)";
  }
  return gradients[firstChar];
};

const getTagIcon = (tag) => {
  const tagLower = tag.toLowerCase();
  switch (tagLower) {
    case "vue":
      return "iconfont icon-vuejs";
    case "nodejs":
      return "iconfont icon-Nodejs";
    case "nuxt":
      return "iconfont icon-nuxt";
    case "h5":
      return "iconfont icon-iphone";
    default:
      return "";
  }
};

// 切换分类
const setActiveCategory = (category) => {
  activeCategory.value = category;
};
</script>

<template>
  <div class="bookmarks" :class="{ 'dark-mode': isDarkMode }">
    <!-- 分类标签导航 -->
    <div class="category-tabs">
      <div 
        v-for="category in categoryList" 
        :key="category" 
        class="category-tab" 
        :class="{ active: activeCategory === category }"
        @click="setActiveCategory(category)"
      >
        {{ category }}
      </div>
    </div>
    
    <div class="bookmark-container">
      <div v-for="category in filteredBookmarks" :key="category.name" class="bookmark-category">
        <h2 class="category-title">
          <img
            v-if="category.icon && category.icon.startsWith('http')"
            :src="category.icon"
            class="category-icon"
          />
          <i
            v-else-if="category.icon"
            :class="category.icon"
            class="category-icon"
          ></i>
          {{ category.name }}
        </h2>
        
        <div class="bookmark-items">
          <a
            v-for="item in category.items"
            :key="item.name"
            :href="item.urls.prod"
            class="bookmark-item"
            target="_blank"
          >
            <div class="bookmark-content">
              <div
                class="name-avatar"
                :style="{
                  background: getAvatarGradient(item.name, category.type),
                }"
              >
                {{ item.name.slice(0, 1).toUpperCase() }}
              </div>
              <div class="item-name">{{ item.name }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bookmarks {
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    
    .category-tab {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
      color: #666;
      background-color: #f5f5f5;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: #e0e0e0;
      }
      
      &.active {
        background-color: #1890ff;
        color: white;
      }
    }
  }
  
  .bookmark-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .bookmark-category {
    margin-bottom: 20px;
    
    .category-title {
      margin: 0 0 16px 10px;
      font-size: 16px;
      font-weight: 500;
      color: #666;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .category-icon {
        width: 18px;
        height: 18px;
        object-fit: contain;
      }
    }
    
    .bookmark-items {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: flex-start;
      
      .bookmark-item {
        text-decoration: none;
        height: 40px;
        padding: 0 10px;
        border-radius: 8px;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        overflow: hidden;
        transition: all 0.2s ease;
        width: 256px;
        max-width: 100%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid #f0f0f0;
        
        &:hover {
          background-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        
        .bookmark-content {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          
          .name-avatar {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #fff;
            flex-shrink: 0;
          }
          
          .item-name {
            font-size: 14px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}

// 暗黑模式
.dark-mode {
  .category-tabs {
    border-bottom-color: #333;
    
    .category-tab {
      background-color: #333;
      color: #aaa;
      
      &:hover {
        background-color: #444;
      }
      
      &.active {
        background-color: #1890ff;
        color: white;
      }
    }
  }

  .bookmark-category {
    .category-title {
      color: #aaa;
    }
    
    .bookmark-items {
      .bookmark-item {
        background-color: #2a2a2a;
        border-color: #333;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        
        &:hover {
          background-color: #2a2a2a;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .bookmark-content {
          .item-name {
            color: #eee;
          }
        }
      }
    }
  }
}
</style>
