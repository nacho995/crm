<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">
                {{ client ? 'Editar Cliente' : 'Agregar Cliente' }}
              </h3>
              <div class="mt-6">
                <form @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-1 gap-6">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">
                        Nombre completo *
                      </label>
                      <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="Ej: Juan Pérez García"
                      />
                    </div>

                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        class="input-field mt-1"
                        placeholder="juan@email.com"
                      />
                    </div>

                    <div>
                      <label for="phone" class="block text-sm font-medium text-gray-700">
                        Teléfono *
                      </label>
                      <input
                        id="phone"
                        v-model="form.phone"
                        type="tel"
                        required
                        class="input-field mt-1"
                        placeholder="+34 600 123 456"
                      />
                    </div>

                    <div>
                      <label for="dni" class="block text-sm font-medium text-gray-700">
                        DNI/NIE *
                      </label>
                      <input
                        id="dni"
                        v-model="form.dni"
                        type="text"
                        required
                        class="input-field mt-1"
                        placeholder="12345678A"
                      />
                    </div>

                    <div>
                      <label for="address" class="block text-sm font-medium text-gray-700">
                        Dirección
                      </label>
                      <textarea
                        id="address"
                        v-model="form.address"
                        rows="3"
                        class="input-field mt-1"
                        placeholder="Calle, número, ciudad, código postal"
                      ></textarea>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="btn-secondary"
                      @click="$emit('close')"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="btn-primary"
                      :disabled="!isFormValid"
                    >
                      {{ client ? 'Actualizar' : 'Agregar' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  client: Object
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  name: '',
  email: '',
  phone: '',
  dni: '',
  address: ''
})

const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.phone && 
         form.value.dni
})

watch(() => props.client, (newClient) => {
  if (newClient) {
    form.value = {
      name: newClient.name || '',
      email: newClient.email || '',
      phone: newClient.phone || '',
      dni: newClient.dni || '',
      address: newClient.address || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})

function resetForm() {
  form.value = {
    name: '',
    email: '',
    phone: '',
    dni: '',
    address: ''
  }
}

function handleSubmit() {
  if (isFormValid.value) {
    emit('save', { ...form.value })
  }
}
</script> 