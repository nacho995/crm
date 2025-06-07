import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePropertiesStore = defineStore('properties', () => {
  const properties = ref([])

  const totalProperties = computed(() => properties.value.length)
  
  const propertiesByType = computed(() => {
    const types = {}
    properties.value.forEach(property => {
      types[property.type] = (types[property.type] || 0) + 1
    })
    return types
  })

  const propertiesByCity = computed(() => {
    const cities = {}
    properties.value.forEach(property => {
      cities[property.city] = (cities[property.city] || 0) + 1
    })
    return cities
  })

  function addProperty(property) {
    const newProperty = {
      ...property,
      id: Date.now(),
      createdAt: new Date(),
      images: property.images || []
    }
    properties.value.push(newProperty)
    return newProperty
  }

  function updateProperty(id, updatedProperty) {
    const index = properties.value.findIndex(property => property.id === id)
    if (index !== -1) {
      properties.value[index] = { ...properties.value[index], ...updatedProperty }
      return properties.value[index]
    }
    return null
  }

  function deleteProperty(id) {
    const index = properties.value.findIndex(property => property.id === id)
    if (index !== -1) {
      properties.value.splice(index, 1)
      return true
    }
    return false
  }

  function getPropertyById(id) {
    return properties.value.find(property => property.id === id)
  }

  function getPropertiesByClient(clientId) {
    return properties.value.filter(property => property.clientId === clientId)
  }

  function searchProperties(query) {
    if (!query) return properties.value
    const searchTerm = query.toLowerCase()
    return properties.value.filter(property => 
      property.address.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.type.toLowerCase().includes(searchTerm) ||
      property.cadastralReference.toLowerCase().includes(searchTerm)
    )
  }

  return {
    properties,
    totalProperties,
    propertiesByType,
    propertiesByCity,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    getPropertiesByClient,
    searchProperties
  }
}) 