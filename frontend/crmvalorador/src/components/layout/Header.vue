<template>
  <header class="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
    <div class="flex h-14 sm:h-16 items-center gap-x-2 sm:gap-x-4 px-3 sm:px-4 md:px-6 lg:px-8">
      <!-- Mobile menu button -->
      <button 
        type="button" 
        class="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-md transition-colors" 
        @click="$emit('toggle-sidebar')"
      >
        <Bars3Icon class="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      </button>

      <!-- Separator -->
      <div class="h-4 sm:h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div class="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
        <!-- Search area (responsive) -->
        <div class="relative flex flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div class="relative w-full">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="search"
              placeholder="Buscar..."
              class="block w-full rounded-md border-0 bg-gray-50 py-1.5 sm:py-2 pl-9 sm:pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          <!-- Notifications -->
          <button 
            type="button" 
            class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors relative"
          >
            <BellIcon class="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <!-- Notification badge -->
            <span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          <!-- Separator -->
          <div class="hidden sm:block h-6 w-px bg-gray-200" aria-hidden="true" />

          <!-- Profile dropdown -->
          <div class="relative">
            <button 
              type="button" 
              class="-m-1.5 flex items-center p-1.5 hover:bg-gray-100 rounded-md transition-colors" 
              @click="showProfileMenu = !showProfileMenu"
            >
              <span class="sr-only">Abrir menú de usuario</span>
              <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span class="text-xs sm:text-sm font-medium text-white">U</span>
              </div>
              <span class="hidden sm:flex sm:items-center">
                <span class="ml-2 sm:ml-4 text-sm font-semibold leading-6 text-gray-900">Usuario</span>
                <ChevronDownIcon class="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
              </span>
            </button>

            <!-- Profile dropdown menu -->
            <div
              v-if="showProfileMenu"
              class="absolute right-0 z-10 mt-2.5 w-40 sm:w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 border border-gray-200"
              @click="showProfileMenu = false"
            >
              <router-link 
                to="/settings" 
                class="block px-3 py-2 text-sm leading-6 text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center">
                  <UserIcon class="h-4 w-4 mr-2 text-gray-400" />
                  Perfil
                </div>
              </router-link>
              <router-link 
                to="/settings" 
                class="block px-3 py-2 text-sm leading-6 text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center">
                  <CogIcon class="h-4 w-4 mr-2 text-gray-400" />
                  Configuración
                </div>
              </router-link>
              <hr class="my-1 border-gray-200" />
              <a 
                href="#" 
                class="block px-3 py-2 text-sm leading-6 text-red-600 hover:bg-red-50 transition-colors"
              >
                <div class="flex items-center">
                  <ArrowRightOnRectangleIcon class="h-4 w-4 mr-2 text-red-500" />
                  Cerrar sesión
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Bars3Icon, 
  BellIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const showProfileMenu = ref(false)

defineEmits(['toggle-sidebar'])

// Cerrar el menú cuando se hace clic fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.relative')) {
    showProfileMenu.value = false
  }
})
</script> 