import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useValuationsStore = defineStore('valuations', () => {
  const valuations = ref([])

  const totalValuations = computed(() => valuations.value.length)
  
  const completedValuations = computed(() => 
    valuations.value.filter(valuation => valuation.status === 'Completada')
  )

  const pendingValuations = computed(() => 
    valuations.value.filter(valuation => valuation.status === 'Pendiente')
  )

  const inProgressValuations = computed(() => 
    valuations.value.filter(valuation => valuation.status === 'En Proceso')
  )

  const averageValuationAmount = computed(() => {
    if (completedValuations.value.length === 0) return 0
    const total = completedValuations.value.reduce((sum, val) => sum + val.valuationAmount, 0)
    return total / completedValuations.value.length
  })

  const valuationsByStatus = computed(() => {
    const statuses = {}
    valuations.value.forEach(valuation => {
      statuses[valuation.status] = (statuses[valuation.status] || 0) + 1
    })
    return statuses
  })

  function addValuation(valuation) {
    const newValuation = {
      ...valuation,
      id: Date.now(),
      requestDate: new Date(),
      status: 'Pendiente',
      documentGenerated: false,
      comparables: valuation.comparables || [],
      observations: valuation.observations || ''
    }
    valuations.value.push(newValuation)
    return newValuation
  }

  function updateValuation(id, updatedValuation) {
    const index = valuations.value.findIndex(valuation => valuation.id === id)
    if (index !== -1) {
      valuations.value[index] = { ...valuations.value[index], ...updatedValuation }
      return valuations.value[index]
    }
    return null
  }

  function deleteValuation(id) {
    const index = valuations.value.findIndex(valuation => valuation.id === id)
    if (index !== -1) {
      valuations.value.splice(index, 1)
      return true
    }
    return false
  }

  function getValuationById(id) {
    return valuations.value.find(valuation => valuation.id === id)
  }

  function getValuationsByClient(clientId) {
    return valuations.value.filter(valuation => valuation.clientId === clientId)
  }

  function getValuationsByProperty(propertyId) {
    return valuations.value.filter(valuation => valuation.propertyId === propertyId)
  }

  function completeValuation(id, valuationData) {
    const valuation = getValuationById(id)
    if (valuation) {
      return updateValuation(id, {
        ...valuationData,
        status: 'Completada',
        completionDate: new Date()
      })
    }
    return null
  }

  function startValuation(id) {
    const valuation = getValuationById(id)
    if (valuation && valuation.status === 'Pendiente') {
      return updateValuation(id, {
        status: 'En Proceso',
        startDate: new Date()
      })
    }
    return null
  }

  function searchValuations(query) {
    if (!query) return valuations.value
    const searchTerm = query.toLowerCase()
    return valuations.value.filter(valuation => 
      valuation.type.toLowerCase().includes(searchTerm) ||
      valuation.purpose.toLowerCase().includes(searchTerm) ||
      valuation.status.toLowerCase().includes(searchTerm) ||
      (valuation.appraiser && valuation.appraiser.toLowerCase().includes(searchTerm))
    )
  }

  return {
    valuations,
    totalValuations,
    completedValuations,
    pendingValuations,
    inProgressValuations,
    averageValuationAmount,
    valuationsByStatus,
    addValuation,
    updateValuation,
    deleteValuation,
    getValuationById,
    getValuationsByClient,
    getValuationsByProperty,
    completeValuation,
    startValuation,
    searchValuations
  }
}) 