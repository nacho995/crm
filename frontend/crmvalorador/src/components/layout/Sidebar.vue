<template>
  <!-- Desktop sidebar -->
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
    <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
      <div class="flex h-16 shrink-0 items-center">
        <div class="flex items-center">
          <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
            <BuildingOfficeIcon class="h-5 w-5 text-white" />
          </div>
          <h1 class="text-xl font-bold text-primary-600">CRM Valorador</h1>
        </div>
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <router-link
                  :to="item.href"
                  :class="[
                    $route.path === item.href
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                    'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-all duration-200'
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      $route.path === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                      'h-6 w-6 shrink-0 transition-colors duration-200'
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </li>
          
          <!-- Footer section -->
          <li class="mt-auto">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center">
                <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-primary-600">U</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Usuario</p>
                  <p class="text-xs text-gray-500">Tasador Certificado</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Mobile sidebar overlay -->
  <div v-if="sidebarOpen" class="relative z-50 lg:hidden">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-gray-900/80 transition-opacity duration-300" 
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar panel -->
    <div class="fixed inset-0 flex">
      <div class="relative mr-16 flex w-full max-w-xs flex-1">
        <!-- Close button -->
        <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
          <button 
            type="button" 
            class="-m-2.5 p-2.5 hover:bg-gray-800 rounded-md transition-colors" 
            @click="closeSidebar"
          >
            <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
        
        <!-- Sidebar content -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 sm:px-6 pb-4">
          <!-- Header -->
          <div class="flex h-14 sm:h-16 shrink-0 items-center">
            <div class="flex items-center">
              <div class="h-7 w-7 sm:h-8 sm:w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <BuildingOfficeIcon class="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 class="text-lg sm:text-xl font-bold text-primary-600">CRM Valorador</h1>
            </div>
          </div>
          
          <!-- Navigation -->
          <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="-mx-2 space-y-1">
                  <li v-for="item in navigation" :key="item.name">
                    <router-link
                      :to="item.href"
                      :class="[
                        $route.path === item.href
                          ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-all duration-200'
                      ]"
                      @click="closeSidebar"
                    >
                      <component
                        :is="item.icon"
                        :class="[
                          $route.path === item.href ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600',
                          'h-5 w-5 sm:h-6 sm:w-6 shrink-0 transition-colors duration-200'
                        ]"
                        aria-hidden="true"
                      />
                      {{ item.name }}
                    </router-link>
                  </li>
                </ul>
              </li>
              
              <!-- Mobile footer -->
              <li class="mt-auto">
                <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div class="flex items-center">
                    <div class="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-xs sm:text-sm font-medium text-primary-600">U</span>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">Usuario</p>
                      <p class="text-xs text-gray-500">Tasador Certificado</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeIcon, 
  UsersIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  MapIcon,
  FolderIcon, 
  ChartBarIcon, 
  CogIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const sidebarOpen = ref(false)

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clientes', href: '/clients', icon: UsersIcon },
  { name: 'Propiedades', href: '/properties', icon: BuildingOfficeIcon },
  { name: 'Valoraciones', href: '/valuations', icon: DocumentTextIcon },
  { name: 'Mapa', href: '/map', icon: MapIcon },
  { name: 'Documentos', href: '/documents', icon: FolderIcon },
  { name: 'Reportes', href: '/reports', icon: ChartBarIcon },
  { name: 'Configuración', href: '/settings', icon: CogIcon },
]

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Cerrar sidebar cuando cambie la ruta en mobile
watch(route, () => {
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
})

// Función para toggle desde el header
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

defineExpose({
  sidebarOpen,
  toggleSidebar
})
</script> 