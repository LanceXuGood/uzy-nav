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
        <div class="pixilart-logo">
          <span class="pixel-heart">❤</span> YOUZY
        </div>
      </div>
      
      <div class="nav-menu">
        <div class="tab-nav">
          <router-link
            to="/business"
            class="tab-btn"
            :class="{ active: route.path === '/business' }"
          >
            <div class="circle-icon hp-icon">HP</div>
            业务
          </router-link>
          <router-link
            to="/management"
            class="tab-btn"
            :class="{ active: route.path === '/management' }"
          >
            <div class="circle-icon mp-icon">MP</div>
            管理
          </router-link>
          <router-link
            to="/service"
            class="tab-btn"
            :class="{ active: route.path === '/service' }"
          >
            <div class="circle-icon def-icon">DEF</div>
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
      <div class="top-header">
        <div class="header-links">
         
        </div>
        <button class="start-drawing-btn">
          <span class="btn-icon">✏️</span> START DRAWING
        </button>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #f5f5f5;
}

.sidebar {
  width: 220px;
  background-color: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  
  .logo {
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .pixilart-logo {
      font-size: 18px;
      font-weight: 700;
      color: #333;
      display: flex;
      align-items: center;
      
      .pixel-heart {
        color: #6C5CE7;
        font-size: 20px;
        margin-right: 5px;
      }
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
    border-top: 1px solid #eee;

    .theme-btn {
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 0;
  background: #f8f9fa;
  margin-left: 220px;
  
  .top-header {
    margin-bottom: 10px;
    height: 63px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    .header-links {
      display: flex;
      gap: 20px;
      
      .header-link {
        text-decoration: none;
        color: #444;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 5px;
        
        .header-icon {
          font-size: 15px;
        }
        
        &:hover {
          color: #6C5CE7;
        }
      }
    }
    
    .start-drawing-btn {
      background-color: #6C5CE7;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      
      &:hover {
        background-color: #5B4BC4;
      }
    }
  }
  
  .secondary-nav {
    height: 40px;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    margin-top: 1px;
    
    .sec-nav-item {
      text-decoration: none;
      color: #555;
      font-size: 12px;
      font-weight: 600;
      padding: 0 15px;
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
      
      &:hover {
        color: #6C5CE7;
      }
      
      &.active {
        color: #6C5CE7;
        
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 15px;
          right: 15px;
          height: 3px;
          background-color: #6C5CE7;
        }
      }
    }
  }
}

.tab-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 15px;

  .tab-btn {
    padding: 12px 10px;
    text-decoration: none;
    font-size: 16px;
    color: #555;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background-color 0.2s;

    .circle-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      font-style: normal;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .hp-icon {
      background-color: #E53935;
    }
    
    .mp-icon {
      background-color: #2196F3;
    }
    
    .def-icon {
      background-color: #FDD835;
    }
    
    .atk-icon {
      background-color: #FF9800;
    }
    
    .spa-icon {
      background-color: #4FC3F7;
    }
    
    .spd-icon {
      background-color: #8BC34A;
    }
    
    .spdef-icon {
      background-color: #F48FB1;
    }

    &:hover {
      background-color: #f0f2f5;
    }

    &.active {
      background-color: #ede7f6;
      font-weight: 600;
      color: #6C5CE7;
      
      .circle-icon {
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// 暗黑模式
.dark-mode {
  background-color: #1a1a1a;
  
  .sidebar {
    background-color: #252525;
    border-right-color: #333;
    
    .logo {
      border-bottom-color: #333;
      
      .pixilart-logo {
        color: #eee;
      }
    }
    
    .theme-toggle {
      border-top-color: #333;
      
      .theme-btn {
        color: #eee;
        
        &:hover {
          background-color: #333;
        }
      }
    }
  }

  .main-content {
    background: #1a1a1a;
    
    .top-header {
      background-color: #252525;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      
      .header-links {
        .header-link {
          color: #ccc;
          
          &:hover {
            color: #A097EC;
          }
        }
      }
    }
    
    .secondary-nav {
      background-color: #252525;
      border-color: #333;
      
      .sec-nav-item {
        color: #ccc;
        
        &:hover {
          color: #A097EC;
        }
        
        &.active {
          color: #A097EC;
          
          &:after {
            background-color: #A097EC;
          }
        }
      }
    }
  }

  .tab-nav {
    .tab-btn {
      color: #ccc;

      .circle-icon {
        filter: brightness(0.9) contrast(1.1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      &:hover {
        background-color: #333;
      }

      &.active {
        background-color: #2d1b36;
        color: #A097EC;
        
        .circle-icon {
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}
</style>
