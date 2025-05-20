<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isDrawerOpen = ref(true);

// 从 localStorage 初始化主题状态
const isDarkMode = ref(localStorage.getItem("theme") === "dark");

// 切换主题的方法
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
};

// 页面加载时初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    localStorage.setItem("theme", "light");
  } else {
    isDarkMode.value = savedTheme === "dark";
  }
});
</script>

<template>
  <div
    class="app-container"
    :class="{ 'drawer-open': isDrawerOpen, 'dark-mode': isDarkMode }"
  >
    <!-- 侧边导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <img src="https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg" alt="Street Fighter 6" class="sf-logo">
      </div>
      
      <div class="nav-menu">
        <div class="tab-nav">
          <router-link
            to="/business"
            class="tab-btn"
            :class="{ active: route.path === '/business' }"
          >
            <i class="ri-building-2-line"></i>
            业务
          </router-link>
          <router-link
            to="/management"
            class="tab-btn"
            :class="{ active: route.path === '/management' }"
          >
            <i class="ri-database-2-line"></i>
            管理
          </router-link>
          <router-link
            to="/service"
            class="tab-btn"
            :class="{ active: route.path === '/service' }"
          >
            <i class="ri-terminal-box-line"></i>
            服务
          </router-link>
        </div>
      </div>
      
      <div class="theme-toggle">
        <button @click="toggleTheme" class="theme-btn">
          {{ isDarkMode ? "☀️" : "🌙" }}
        </button>
      </div>
    </div>
    
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
  
  .logo {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    
    .sf-logo {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
  
  .nav-menu {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }
  
  .theme-toggle {
    padding: 16px;
    display: flex;
    justify-content: center;
    border-top: 1px solid #f0f0f0;

    .theme-btn {
      padding: 8px;
      font-size: 16px;
      background: #f5f5f5;
      color: #333;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        background: #e0e0e0;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: #f9f9f9;
  margin-left: 240px;
}

.tab-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .tab-btn {
    padding: 12px 20px;
    text-decoration: none;
    font-size: 14px;
    color: #666;
    border-radius: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
    position: relative;

    i {
      font-size: 18px;
    }

    &:hover {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
    }

    &.active {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.15);
      border-right: 3px solid #1890ff;
    }
  }
}

// 暗黑模式
.dark-mode {
  .sidebar {
    background: #1a1a1a;
    border-right-color: #333;
    
    .logo {
      border-bottom-color: #333;
    }
    
    .theme-toggle {
      border-top-color: #333;
      
      .theme-btn {
        background: #333;
        color: #eee;
        
        &:hover {
          background: #444;
        }
      }
    }
  }

  .main-content {
    background: #1a1a1a;
  }

  .tab-nav {
    .tab-btn {
      color: #bbb;

      &:hover {
        color: #1890ff;
        background: rgba(24, 144, 255, 0.2);
      }

      &.active {
        color: #1890ff;
        background: rgba(24, 144, 255, 0.25);
      }
    }
  }
}
</style>
