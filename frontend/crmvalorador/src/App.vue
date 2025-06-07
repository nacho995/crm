<script setup>
import { ref } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import DebugPanel from './components/DebugPanel.vue'

const sidebarRef = ref(null)

const toggleSidebar = () => {
  if (sidebarRef.value) {
    sidebarRef.value.toggleSidebar()
  }
}
</script>

<template>
  <div id="app">
    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" />
    
    <!-- Main Area -->
    <div class="app-main">
      <Header @toggle-sidebar="toggleSidebar" />
      <main class="app-content">
        <router-view />
      </main>
    </div>
    
    <!-- Debug Panel -->
    <DebugPanel v-if="$route.meta.showDebug !== false" />
  </div>
</template>

<style>
/* Global reset */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Mobile: Stack vertically */
@media (max-width: 1023px) {
  #app {
    flex-direction: column;
  }
  
  .app-main {
    width: 100%;
  }
}

/* Desktop: Side by side */
@media (min-width: 1024px) {
  #app {
    flex-direction: row;
  }
  
  .app-main {
    flex: 1;
    margin-left: 256px; /* Width of sidebar */
    width: calc(100% - 256px);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
}

.app-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-content {
  flex: 1;
  background-color: white;
  width: 100%;
  overflow-y: auto;
}

/* Ensure content uses full width */
.app-content > * {
  width: 100%;
}
</style>

