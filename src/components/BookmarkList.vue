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

const getCategoryObj = (category) => {
  if (category === '所有') {
    return {
      name: '所有',
      pokemon: {
        static: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/493.png",
        animated: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/493.gif"
      }
    };
  }
  return bookmarks.value.find(b => b.name === category);
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
        <div class="pokemon-container">
          <img 
            v-if="getCategoryObj(category)?.pokemon?.static" 
            class="static-img" 
            :src="getCategoryObj(category)?.pokemon?.static" 
            :alt="category" 
          />
          <img 
            v-if="getCategoryObj(category)?.pokemon?.animated" 
            class="animated-img" 
            :src="getCategoryObj(category)?.pokemon?.animated" 
            :alt="category + ' animated'" 
          />
        </div>
        {{ category }}
      </div>
    </div>
    
    <div class="bookmark-container">
      <div v-for="category in filteredBookmarks" :key="category.name" class="bookmark-category">
        <h2 class="category-title">
          {{ category.name }}
        </h2>
        
        <div class="bookmark-items">
          <div
            v-for="item in category.items"
            :key="item.name"
            class="bookmark-item-wrapper"
          >
            <a
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
                <div class="item-icon" v-if="item.name.toLowerCase().includes('h5')">
                  <div class="pixel-phone"></div>
                </div>
              </div>
            </a>
            <div class="env-links">
              <a v-if="item.urls.test" :href="item.urls.test" target="_blank" class="test-env-link">测试环境</a>
              <a :href="item.urls.prod" target="_blank" class="prod-env-link">正式环境</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bookmarks {
  font-family: 'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  background-color: #f8f9fa;
  
  .category-tabs {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 3px solid #e4e7ec;
    
    .category-tab {
      padding: 8px 32px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      background-color: white;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      
      .pokemon-container {
        position: relative;
        width: 32px;
        height: 32px;
        margin-right: 10px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: absolute;
          top: 0;
          left: 0;
          transition: all 0.3s ease;
        }
        
        .static-img {
          opacity: 1;
          transform: scale(1);
        }
        
        .animated-img {
          opacity: 0;
          transform: scale(0.9);
        }
      }
      
      &:hover {
        background-color: #f0f2f5;
        transform: translateY(-2px);
      }
      
      &.active {
        background-color: white;
        color: #6C5CE7;
        border: 2px solid #6C5CE7;
        
        .pokemon-container {
          transform: translateY(-1px);
          
          .static-img {
            opacity: 0;
            transform: scale(1.1);
          }
          
          .animated-img {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      }
    }
  }
  
  .bookmark-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;
  }

  .bookmark-category {
    .category-title {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 700;
      color: #444;
      display: flex;
      align-items: center;
    }
    
    &:hover {
      // 移除悬停效果
    }
    
    .bookmark-items {
      display: flex;
      flex-wrap: wrap;
      gap: 24px 24px;
      justify-content: flex-start;
      margin-bottom: 40px;
      
      .bookmark-item-wrapper {
        width: 256px;
        max-width: 100%;
        position: relative;
        
        &:hover {
          .env-links {
            opacity: 1;
            visibility: visible;
          }
        }
      
        .bookmark-item {
          text-decoration: none;
          height: 50px;
          padding: 0 15px;
          border-radius: 10px;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          
          .bookmark-content {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            
            .name-avatar {
              width: 30px;
              height: 30px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              color: #fff;
              flex-shrink: 0;
              border: 2px solid rgba(255, 255, 255, 0.5);
            }
            
            .item-name {
              font-size: 15px;
              font-weight: 600;
              color: #444;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              flex: 1;
            }
            
            .item-icon {
              display: flex;
              align-items: center;
              color: #6C5CE7;
              margin-left: auto;
              
              .pixel-phone {
                width: 16px;
                height: 22px;
                position: relative;
                border: 2px solid #444;
                border-radius: 2px;
                background: linear-gradient(135deg, #6C5CE7 0%, #FF7675 100%);
                
                &:before {
                  content: "";
                  position: absolute;
                  width: 6px;
                  height: 2px;
                  background-color: #fff;
                  top: 3px;
                  left: 50%;
                  transform: translateX(-50%);
                  border-radius: 1px;
                }
                
                &:after {
                  content: "";
                  position: absolute;
                  width: 4px;
                  height: 4px;
                  border: 1px solid #fff;
                  bottom: 3px;
                  left: 50%;
                  transform: translateX(-50%);
                  border-radius: 50%;
                }
              }
            }
          }
        }
        
        .env-links {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 40px;
          padding: 0 10px;
          background-color: #333333;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          position: absolute;
          top: 45px;
          left: 0;
          z-index: 1;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease, background-color 0.3s ease;
          
          .test-env-link, .prod-env-link {
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            padding: 0 15px;
          }
          
          .test-env-link {
            color: #FF5252;
            
            &:hover {
              text-decoration: underline;
            }
          }
          
          .prod-env-link {
            color: #3498db;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}

// 暗黑模式
.dark-mode {
  background-color: #202124;
  .bookmarks{
    background-color: #202124;
  }
  .category-tabs {
    border-bottom-color: #3D3D3D;
    
    .category-tab {
      background-color: #2D2D30;
      color: #BBB;
      border-color: #3D3D3D;
      
      .pokemon-container {
        img {
          filter: brightness(0.9) contrast(1.1);
        }
      }
      
      &:hover {
        background-color: #3A3A3E;
      }
      
      &.active {
        background-color: #2D2D30;
        color: #A097EC;
        border: 2px solid #A097EC;
        
        .pokemon-container {
          transform: translateY(-1px);
          
          .static-img {
            opacity: 0;
            transform: scale(1.1);
          }
          
          .animated-img {
            opacity: 1;
            transform: scale(1.05);
            filter: brightness(1.1) contrast(1.2) drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
          }
        }
      }
    }
  }

  .bookmark-category {
    .category-title {
      color: #DDD;
    }
    
    .bookmark-items {
      .bookmark-item-wrapper {
        &:hover {
          .env-links {
            opacity: 1;
            visibility: visible;
          }
        }
        
        .bookmark-item {
          background-color: #2D2D30;
          border-color: #3D3D3D;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
          
          .bookmark-content {
            .name-avatar {
              border-color: rgba(255, 255, 255, 0.2);
            }
            
            .item-name {
              color: #DDD;
            }
            
            .item-icon {
              color: #A097EC;
              
              .pixel-phone {
                border-color: #666;
                background: linear-gradient(135deg, #A097EC 0%, #FF9797 100%);
              }
            }
          }
        }
        
        .env-links {
          background-color: #222222;
          
          .test-env-link {
            color: #FF7675;
            
            &:hover {
              text-decoration: underline;
            }
          }
          
          .prod-env-link {
            color: #A097EC;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  
  .bookmark-items .bookmark-item-wrapper:hover .env-links {
    background-color: #2D2D30;
  }
}
</style>
