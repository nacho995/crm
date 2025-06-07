<template>
  <div v-if="show" class="relative z-50">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">
                {{ property ? 'Editar Propiedad' : 'Agregar Propiedad' }}
              </h3>
              <div class="mt-6">
                <form @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Información básica -->
                    <div class="space-y-6">
                      <h4 class="text-md font-medium text-gray-900">Información Básica</h4>
                      
                      <div>
                        <label for="clientId" class="block text-sm font-medium text-gray-700">
                          Cliente *
                        </label>
                        <select
                          id="clientId"
                          v-model="form.clientId"
                          required
                          class="input-field mt-1"
                        >
                          <option value="">Seleccionar cliente</option>
                          <option v-for="client in clientsStore.clients" :key="client.id" :value="client.id">
                            {{ client.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label for="type" class="block text-sm font-medium text-gray-700">
                          Tipo de propiedad *
                        </label>
                        <select
                          id="type"
                          v-model="form.type"
                          required
                          class="input-field mt-1"
                        >
                          <option value="">Seleccionar tipo</option>
                          <option value="Piso">Piso</option>
                          <option value="Casa">Casa</option>
                          <option value="Chalet">Chalet</option>
                          <option value="Local">Local</option>
                          <option value="Oficina">Oficina</option>
                          <option value="Garaje">Garaje</option>
                        </select>
                      </div>

                      <div>
                        <label for="address" class="block text-sm font-medium text-gray-700">
                          Dirección *
                        </label>
                        <input
                          id="address"
                          v-model="form.address"
                          type="text"
                          required
                          class="input-field mt-1"
                          placeholder="Calle y número"
                        />
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="postalCode" class="block text-sm font-medium text-gray-700">
                            Código Postal *
                          </label>
                          <input
                            id="postalCode"
                            v-model="form.postalCode"
                            type="text"
                            required
                            class="input-field mt-1"
                            placeholder="28001"
                          />
                        </div>
                        <div>
                          <label for="city" class="block text-sm font-medium text-gray-700">
                            Ciudad *
                          </label>
                          <input
                            id="city"
                            v-model="form.city"
                            type="text"
                            required
                            class="input-field mt-1"
                            placeholder="Madrid"
                          />
                        </div>
                      </div>

                      <div>
                        <label for="province" class="block text-sm font-medium text-gray-700">
                          Provincia *
                        </label>
                        <input
                          id="province"
                          v-model="form.province"
                          type="text"
                          required
                          class="input-field mt-1"
                          placeholder="Madrid"
                        />
                      </div>

                      <div>
                        <label for="currentValue" class="block text-sm font-medium text-gray-700">
                          Valor actual (€)
                        </label>
                        <input
                          id="currentValue"
                          v-model.number="form.currentValue"
                          type="number"
                          min="0"
                          step="1000"
                          class="input-field mt-1"
                          placeholder="450000"
                        />
                      </div>
                    </div>

                    <!-- Características -->
                    <div class="space-y-6">
                      <h4 class="text-md font-medium text-gray-900">Características</h4>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="surface" class="block text-sm font-medium text-gray-700">
                            Superficie (m²) *
                          </label>
                          <input
                            id="surface"
                            v-model.number="form.surface"
                            type="number"
                            min="1"
                            required
                            class="input-field mt-1"
                            placeholder="120"
                          />
                        </div>
                        <div>
                          <label for="constructionYear" class="block text-sm font-medium text-gray-700">
                            Año construcción
                          </label>
                          <input
                            id="constructionYear"
                            v-model.number="form.constructionYear"
                            type="number"
                            min="1800"
                            :max="new Date().getFullYear()"
                            class="input-field mt-1"
                            placeholder="2005"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-3 gap-4">
                        <div>
                          <label for="rooms" class="block text-sm font-medium text-gray-700">
                            Habitaciones
                          </label>
                          <input
                            id="rooms"
                            v-model.number="form.rooms"
                            type="number"
                            min="0"
                            class="input-field mt-1"
                            placeholder="3"
                          />
                        </div>
                        <div>
                          <label for="bathrooms" class="block text-sm font-medium text-gray-700">
                            Baños
                          </label>
                          <input
                            id="bathrooms"
                            v-model.number="form.bathrooms"
                            type="number"
                            min="0"
                            class="input-field mt-1"
                            placeholder="2"
                          />
                        </div>
                        <div>
                          <label for="floor" class="block text-sm font-medium text-gray-700">
                            Planta
                          </label>
                          <input
                            id="floor"
                            v-model.number="form.floor"
                            type="number"
                            class="input-field mt-1"
                            placeholder="4"
                          />
                        </div>
                      </div>

                      <div>
                        <label for="heating" class="block text-sm font-medium text-gray-700">
                          Calefacción
                        </label>
                        <select
                          id="heating"
                          v-model="form.heating"
                          class="input-field mt-1"
                        >
                          <option value="">Sin especificar</option>
                          <option value="Central">Central</option>
                          <option value="Individual">Individual</option>
                          <option value="Gas">Gas</option>
                          <option value="Eléctrica">Eléctrica</option>
                          <option value="No tiene">No tiene</option>
                        </select>
                      </div>

                      <div>
                        <label for="energyRating" class="block text-sm font-medium text-gray-700">
                          Certificado energético
                        </label>
                        <select
                          id="energyRating"
                          v-model="form.energyRating"
                          class="input-field mt-1"
                        >
                          <option value="">Sin especificar</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                          <option value="G">G</option>
                        </select>
                      </div>

                      <!-- Características adicionales -->
                      <div class="space-y-3">
                        <h5 class="text-sm font-medium text-gray-700">Características adicionales</h5>
                        <div class="grid grid-cols-2 gap-3">
                          <label class="flex items-center">
                            <input
                              v-model="form.elevator"
                              type="checkbox"
                              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Ascensor</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              v-model="form.parking"
                              type="checkbox"
                              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Parking</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              v-model="form.terrace"
                              type="checkbox"
                              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Terraza</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              v-model="form.garden"
                              type="checkbox"
                              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Jardín</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              v-model="form.pool"
                              type="checkbox"
                              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Piscina</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              v-model="form.airConditioning"
                              type="checkbox"
                              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">Aire acondicionado</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Datos registrales -->
                  <div class="mt-8 pt-6 border-t border-gray-200">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Datos Registrales</h4>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label for="cadastralReference" class="block text-sm font-medium text-gray-700">
                          Referencia catastral
                        </label>
                        <input
                          id="cadastralReference"
                          v-model="form.cadastralReference"
                          type="text"
                          class="input-field mt-1"
                          placeholder="1234567890123456789A"
                        />
                      </div>
                      <div class="grid grid-cols-4 gap-3">
                        <div>
                          <label for="volume" class="block text-sm font-medium text-gray-700">
                            Tomo
                          </label>
                          <input
                            id="volume"
                            v-model="form.registryData.volume"
                            type="text"
                            class="input-field mt-1"
                            placeholder="1234"
                          />
                        </div>
                        <div>
                          <label for="book" class="block text-sm font-medium text-gray-700">
                            Libro
                          </label>
                          <input
                            id="book"
                            v-model="form.registryData.book"
                            type="text"
                            class="input-field mt-1"
                            placeholder="567"
                          />
                        </div>
                        <div>
                          <label for="folio" class="block text-sm font-medium text-gray-700">
                            Folio
                          </label>
                          <input
                            id="folio"
                            v-model="form.registryData.folio"
                            type="text"
                            class="input-field mt-1"
                            placeholder="89"
                          />
                        </div>
                        <div>
                          <label for="inscription" class="block text-sm font-medium text-gray-700">
                            Inscripción
                          </label>
                          <input
                            id="inscription"
                            v-model="form.registryData.inscription"
                            type="text"
                            class="input-field mt-1"
                            placeholder="12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-8 flex justify-end space-x-3">
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
                      {{ property ? 'Actualizar' : 'Agregar' }}
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

const clientsStore = useClientsStore()

const props = defineProps({
  show: Boolean,
  property: Object
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  clientId: '',
  type: '',
  address: '',
  postalCode: '',
  city: '',
  province: '',
  surface: null,
  rooms: null,
  bathrooms: null,
  floor: null,
  elevator: false,
  parking: false,
  terrace: false,
  garden: false,
  pool: false,
  heating: '',
  airConditioning: false,
  energyRating: '',
  constructionYear: null,
  cadastralReference: '',
  registryData: {
    volume: '',
    book: '',
    folio: '',
    inscription: ''
  },
  currentValue: null
})

const isFormValid = computed(() => {
  return form.value.clientId && 
         form.value.type && 
         form.value.address && 
         form.value.postalCode && 
         form.value.city && 
         form.value.province && 
         form.value.surface
})

watch(() => props.property, (newProperty) => {
  if (newProperty) {
    form.value = {
      clientId: newProperty.clientId || '',
      type: newProperty.type || '',
      address: newProperty.address || '',
      postalCode: newProperty.postalCode || '',
      city: newProperty.city || '',
      province: newProperty.province || '',
      surface: newProperty.surface || null,
      rooms: newProperty.rooms || null,
      bathrooms: newProperty.bathrooms || null,
      floor: newProperty.floor || null,
      elevator: newProperty.elevator || false,
      parking: newProperty.parking || false,
      terrace: newProperty.terrace || false,
      garden: newProperty.garden || false,
      pool: newProperty.pool || false,
      heating: newProperty.heating || '',
      airConditioning: newProperty.airConditioning || false,
      energyRating: newProperty.energyRating || '',
      constructionYear: newProperty.constructionYear || null,
      cadastralReference: newProperty.cadastralReference || '',
      registryData: {
        volume: newProperty.registryData?.volume || '',
        book: newProperty.registryData?.book || '',
        folio: newProperty.registryData?.folio || '',
        inscription: newProperty.registryData?.inscription || ''
      },
      currentValue: newProperty.currentValue || null
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
    type: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    surface: null,
    rooms: null,
    bathrooms: null,
    floor: null,
    elevator: false,
    parking: false,
    terrace: false,
    garden: false,
    pool: false,
    heating: '',
    airConditioning: false,
    energyRating: '',
    constructionYear: null,
    cadastralReference: '',
    registryData: {
      volume: '',
      book: '',
      folio: '',
      inscription: ''
    },
    currentValue: null
  }
}

function handleSubmit() {
  if (isFormValid.value) {
    emit('save', { ...form.value })
  }
}
</script> 