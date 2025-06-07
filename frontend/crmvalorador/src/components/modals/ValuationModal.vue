<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">
                {{ valuation ? 'Editar Valoración' : 'Nueva Valoración' }}
              </h3>
              <div class="mt-6">
                <form @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-1 gap-6">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="clientId" class="block text-sm font-medium text-gray-700">
                          Cliente *
                        </label>
                        <select
                          id="clientId"
                          v-model="form.clientId"
                          required
                          class="input-field mt-1"
                          @change="onClientChange"
                        >
                          <option value="">Seleccionar cliente</option>
                          <option v-for="client in clientsStore.clients" :key="client.id" :value="client.id">
                            {{ client.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label for="propertyId" class="block text-sm font-medium text-gray-700">
                          Propiedad *
                        </label>
                        <select
                          id="propertyId"
                          v-model="form.propertyId"
                          required
                          class="input-field mt-1"
                          :disabled="!form.clientId"
                        >
                          <option value="">Seleccionar propiedad</option>
                          <option v-for="property in clientProperties" :key="property.id" :value="property.id">
                            {{ property.address }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="type" class="block text-sm font-medium text-gray-700">
                          Tipo de valoración *
                        </label>
                        <select
                          id="type"
                          v-model="form.type"
                          required
                          class="input-field mt-1"
                        >
                          <option value="">Seleccionar tipo</option>
                          <option value="Tasación Hipotecaria">Tasación Hipotecaria</option>
                          <option value="Tasación de Mercado">Tasación de Mercado</option>
                          <option value="Tasación Judicial">Tasación Judicial</option>
                          <option value="Tasación de Seguros">Tasación de Seguros</option>
                          <option value="Valoración Catastral">Valoración Catastral</option>
                        </select>
                      </div>

                      <div>
                        <label for="purpose" class="block text-sm font-medium text-gray-700">
                          Propósito *
                        </label>
                        <select
                          id="purpose"
                          v-model="form.purpose"
                          required
                          class="input-field mt-1"
                        >
                          <option value="">Seleccionar propósito</option>
                          <option value="Compraventa">Compraventa</option>
                          <option value="Hipoteca">Hipoteca</option>
                          <option value="Herencia">Herencia</option>
                          <option value="Divorcio">Divorcio</option>
                          <option value="Seguro">Seguro</option>
                          <option value="Fiscal">Fiscal</option>
                        </select>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="methodology" class="block text-sm font-medium text-gray-700">
                          Metodología
                        </label>
                        <select
                          id="methodology"
                          v-model="form.methodology"
                          class="input-field mt-1"
                        >
                          <option value="">Seleccionar metodología</option>
                          <option value="Comparación">Método de Comparación</option>
                          <option value="Coste">Método del Coste</option>
                          <option value="Residual">Método Residual</option>
                          <option value="Capitalización">Método de Capitalización</option>
                        </select>
                      </div>

                      <div>
                        <label for="appraiser" class="block text-sm font-medium text-gray-700">
                          Tasador
                        </label>
                        <input
                          id="appraiser"
                          v-model="form.appraiser"
                          type="text"
                          class="input-field mt-1"
                          placeholder="Nombre del tasador"
                        />
                      </div>
                    </div>

                    <div>
                      <label for="collegialNumber" class="block text-sm font-medium text-gray-700">
                        Número colegial
                      </label>
                      <input
                        id="collegialNumber"
                        v-model="form.collegialNumber"
                        type="text"
                        class="input-field mt-1"
                        placeholder="COL-12345"
                      />
                    </div>

                    <div>
                      <label for="observations" class="block text-sm font-medium text-gray-700">
                        Observaciones
                      </label>
                      <textarea
                        id="observations"
                        v-model="form.observations"
                        rows="3"
                        class="input-field mt-1"
                        placeholder="Observaciones adicionales sobre la valoración..."
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
                      {{ valuation ? 'Actualizar' : 'Crear' }}
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
import { useClientsStore } from '../../stores/clients'
import { usePropertiesStore } from '../../stores/properties'

const clientsStore = useClientsStore()
const propertiesStore = usePropertiesStore()

const props = defineProps({
  show: Boolean,
  valuation: Object
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  clientId: '',
  propertyId: '',
  type: '',
  purpose: '',
  methodology: '',
  appraiser: '',
  collegialNumber: '',
  observations: ''
})

const isFormValid = computed(() => {
  return form.value.clientId && 
         form.value.propertyId && 
         form.value.type && 
         form.value.purpose
})

const clientProperties = computed(() => {
  if (!form.value.clientId) return []
  return propertiesStore.getPropertiesByClient(parseInt(form.value.clientId))
})

watch(() => props.valuation, (newValuation) => {
  if (newValuation) {
    form.value = {
      clientId: newValuation.clientId || '',
      propertyId: newValuation.propertyId || '',
      type: newValuation.type || '',
      purpose: newValuation.purpose || '',
      methodology: newValuation.methodology || '',
      appraiser: newValuation.appraiser || '',
      collegialNumber: newValuation.collegialNumber || '',
      observations: newValuation.observations || ''
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
    clientId: '',
    propertyId: '',
    type: '',
    purpose: '',
    methodology: '',
    appraiser: '',
    collegialNumber: '',
    observations: ''
  }
}

function onClientChange() {
  // Reset property selection when client changes
  form.value.propertyId = ''
}

function handleSubmit() {
  if (isFormValid.value) {
    emit('save', { ...form.value })
  }
}
</script> 