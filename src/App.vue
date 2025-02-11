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
    <div class="main-content">
      <header class="header">
        <div class="theme-toggle">
          <button @click="toggleTheme" class="theme-btn">
            {{ isDarkMode ? "☀️" : "🌙" }}
          </button>
        </div>
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
            ><i class="ri-terminal-box-line"></i>
            服务
          </router-link>
        </div>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.drawer {
  width: 250px;
  background: #fff;
  border-right: 1px solid #eee;
  transition: transform 0.3s ease;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
}

.header {
  margin-bottom: 3rem;
  text-align: center;

  .tab-nav {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    .tab-btn {
      padding: 0.8rem 2.5rem;
      text-decoration: none;
      font-size: 1.1rem;
      color: #666;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      background: transparent;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: #4caf50;
        transform: translateX(-50%);
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      i {
        font-size: 1.2rem;
        transition: transform 0.3s ease;
      }

      &:hover {
        color: red;
        background: rgba(255, 0, 0, 0.05);

        &::before {
          background: red;
        }

        i {
          transform: scale(1.1);
        }
      }

      &.active {
        color: red;
        background: rgba(255, 0, 0, 0.1);
        font-weight: 500;

        &::before {
          background: red;
        }

        i {
          transform: scale(1.1);
        }
      }
    }
  }
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;

  .theme-btn {
    padding: 0.5rem;
    font-size: 1.2rem;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.dark-mode {
  .main-content {
    background: #1a1a1a;
  }

  .header .tab-nav {
    background: rgba(255, 255, 255, 0.1);

    .tab-btn {
      color: #ccc;

      &::before {
        background: #6ddb71;
      }

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.15);

        &::before {
          background: white;
        }
      }

      &.active {
        color: white;
        background: rgba(255, 255, 255, 0.2);

        &::before {
          background: white;
        }
      }
    }
  }

  .theme-btn {
    background: rgba(255, 255, 255, 0.8);
    color: #000;
  }
}
</style>
