<script setup>
import { ref, onMounted, computed } from "vue";
import draggable from "vuedraggable";

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
    default: false
  }
});

const bookmarks = ref(props.bookmarksData);
const favorites = ref([]);
const searchQuery = ref("");

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

// 搜索过滤
const filteredBookmarks = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return bookmarks.value;

  return bookmarks.value
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

// 保存书签排序顺序
const saveBookmarkOrder = () => {
  localStorage.setItem(
    `${props.storagePrefix}Order`,
    JSON.stringify(bookmarks.value)
  );
};
</script>

<template>
  <div class="bookmarks" :class="{ 'dark-mode': isDarkMode }">
    <draggable
      v-model="bookmarks"
      item-key="name"
      @end="saveBookmarkOrder"
      :animation="200"
      ghost-class="ghost-class"
      handle=".category-header"
      :delay="50"
      :delayOnTouchOnly="true"
    >
      <template #item="{ element: category }">
        <div class="bookmark-category">
          <div class="category-header">
            <div class="title-wrapper">
              <h2>
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
              <!-- <span class="drag-handle">⋮⋮</span> -->
            </div>
          </div>
          <div class="bookmark-grid">
            <div
              v-for="item in category.items"
              :key="item.name"
              class="bookmark-item"
            >
              <div class="bookmark-icon">
                <div
                  class="name-avatar"
                  :style="{
                    background: getAvatarGradient(item.name, category.type),
                  }"
                >
                  {{ item.name.slice(0, 3).toUpperCase() }}
                </div>
                <div class="name-wrapper">
                  <span class="name">
                    {{ item.name }}
                  </span>
                  <div
                    class="tags-wrapper"
                    v-if="item.tags && item.tags.length"
                  >
                    <span v-for="tag in item.tags" :key="tag" class="tag">
                      <i v-if="getTagIcon(tag)" :class="getTagIcon(tag)"></i>
                    </span>
                  </div>
                </div>
                <div class="environment-links">
                  <a
                    :href="item.urls.prod"
                    class="env-link prod"
                    target="_blank"
                    :title="item.urls.prod"
                  >prod</a>
                  <a
                    v-if="item.urls.test"
                    :href="item.urls.test"
                    class="env-link test"
                    target="_blank"
                    :title="item.urls.test"
                  >test</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style lang="less" scoped>
.bookmarks {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  > div {
    width: 100%;
  }

  .search-container {
    margin-bottom: 2rem;

    .search-input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;

      &:focus {
        border-color: #4caf50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
      }
    }
  }

  .bookmark-category {
    background: #fafafa;
    border-radius: 15px;
    padding: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    display: inline-block;
    width: calc(33.333% - 1rem);
    margin-right: 1rem;
    vertical-align: top;
    transition: all 0.3s ease;
    position: relative;

    &:nth-child(3n) {
      margin-right: 0;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 15px;
      padding: 2px;
      background: linear-gradient(45deg,
        rgba(33, 150, 243, 0.6),  // 淡蓝色
        rgba(255, 77, 77, 0.6)    // 淡红色
      );
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 1;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
      cursor: grab;

      &::before {
        opacity: 1;
      }
    }

    &:active {
      cursor: grabbing;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.8rem 1rem;
      position: relative;
      z-index: 2;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;

      &::after {
        content: '⋮⋮';  // 添加拖动图标
        position: absolute;
        right: 1rem;
        color: #999;
        cursor: grab;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.8);  // hover 时略微加深背景

        &::after {
          opacity: 1;  // hover 时显示拖动图标
        }
      }

      // 暗黑模式适配
      .dark-mode & {
        &:hover {
          background: rgba(0, 0, 0, 0.4);
        }

        &::after {
          color: #666;
        }
      }

      .title-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;

        .drag-handle {
          margin-left: auto;
          cursor: grab;
          color: #1890ff;
          font-size: 16px;
          user-select: none;
          padding: 0 4px;

          &.disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }

          &:hover:not(.disabled) {
            color: #40a9ff;
          }

          &:active {
            cursor: grabbing;
          }
        }

        h2 {
          margin: 0;
          font-size: 1.2rem;
          color: #1a1a1a;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;

          .category-icon {
            width: 20px;
            height: 20px;
            object-fit: contain;
            color: #FF9800;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .bookmark-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.8rem;
      min-height: 240px;

      .bookmark-item {
        position: relative;
        background: #ffffff;
        border-radius: 12px;
        height: auto;
        padding: 0.8rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        transition: all 0.3s ease;
        border: 2px solid transparent;
        width: 100%;
        min-height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        &:empty {
          background: rgba(0, 0, 0, 0.02);
          border: 1px dashed #ddd;
        }

        .bookmark-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          font-size: 40px;
          margin-right: 8px;
          color: #1890ff;

          img,
          .name-avatar {
            width: 42px;
            height: 42px;
            margin-bottom: 8px;
            border-radius: 6px;
          }

          .name-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 500;
            color: #fff;
            text-transform: uppercase;
          }

          .name-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            margin-bottom: 8px;
            width: 100%;

            .name {
              font-size: 0.9rem;
              text-align: center;
              color: #333;
              font-weight: 600;
              font-family: -apple-system, "PingFang SC", "Microsoft YaHei",
                sans-serif;
            }

            .tags-wrapper {
              display: flex;
              gap: 4px;
              flex-wrap: wrap;
              justify-content: center;

              .tag {
                font-size: 0.75rem;
                padding: 2px 8px;
                background-color: #fff;
                border-radius: 4px;
                color: #666;
                border: 1px solid #e8e8e8;
                line-height: 1.2;
                display: flex;
                align-items: center;
                gap: 4px;

                i {
                  font-size: 14px;
                  transition: all 0.3s ease;

                  &.icon-vuejs {
                    color: #42b883;
                  }

                  &.icon-Nodejs {
                    color: #539e43;
                  }

                  &.icon-nuxt {
                    font-size: 16px;
                    color: #539e43;
                  }

                  &.icon-iphone {
                    color: #2196F3;
                  }
                }

                &:hover i {
                  transform: scale(1.1);
                }
              }
            }
          }

          .environment-links {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;

            .env-link {
              padding: 2px 8px;
              border-radius: 3px;
              font-size: 0.75rem;
              text-decoration: none;
              color: #666;
              background: #fff;
              transition: all 0.2s ease;
              position: relative;

              &:hover::after {
                content: attr(title);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                padding: 4px 8px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                margin-bottom: 5px;
              }
              
              &:hover::before {
                content: '';
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 5px solid transparent;
                border-top-color: rgba(0, 0, 0, 0.8);
                margin-bottom: -5px;
              }

              &.prod {
                border: 1px solid #4caf50;
                color: #4caf50;
                &:hover {
                  background: #4caf50;
                  color: #fff;
                }
              }

              &.test {
                border: 1px solid #ff9800;
                color: #ff9800;
                &:hover {
                  background: #ff9800;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
}

.ghost-class {
  opacity: 0.5;
  background: #f0f0f0;
}

.sortable-drag {
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.dark-mode {
  .bookmark-category {
    background: #2a2a2a;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

    .category-header {
      background: rgba(0, 0, 0, 0.3);
      
      .title-wrapper {
        h2 {
          color: #ffffff;
        }

        .drag-handle {
          color: #ffffff;
        }
      }
    }

    .bookmark-grid {
      .bookmark-item {
        background: #333333;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        &:empty {
          background: rgba(255, 255, 255, 0.05);
          border-color: #444;
        }

        .bookmark-icon {
          .name-wrapper {
            .name {
              color: #ffffff;
            }

            .tags-wrapper {
              .tag {
                background-color: #404040;
                border-color: #555;
                color: #ccc;
              }
            }
          }

          .environment-links {
            .env-link {
              background: #404040;
              
              &.prod {
                border-color: #4caf50;
                color: #4caf50;
                &:hover {
                  background: #4caf50;
                  color: #fff;
                }
              }

              &.test {
                border-color: #ff9800;
                color: #ff9800;
                &:hover {
                  background: #ff9800;
                  color: #fff;
                }
              }

              &:hover::after {
                background: rgba(255, 255, 255, 0.9);
                color: #333;
              }
              
              &:hover::before {
                border-top-color: rgba(255, 255, 255, 0.9);
              }
            }
          }
        }
      }
    }
  }
}
</style>
