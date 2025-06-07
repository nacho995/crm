import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])

  const totalClients = computed(() => clients.value.length)
  
  const activeClients = computed(() => 
    clients.value.filter(client => client.properties && client.properties.length > 0)
  )

  function addClient(client) {
    const newClient = {
      ...client,
      id: Date.now(),
      createdAt: new Date(),
      properties: [],
      valuations: []
    }
    clients.value.push(newClient)
    return newClient
  }

  function updateClient(id, updatedClient) {
    const index = clients.value.findIndex(client => client.id === id)
    if (index !== -1) {
      clients.value[index] = { ...clients.value[index], ...updatedClient }
      return clients.value[index]
    }
    return null
  }

  function deleteClient(id) {
    const index = clients.value.findIndex(client => client.id === id)
    if (index !== -1) {
      clients.value.splice(index, 1)
      return true
    }
    return false
  }

  function getClientById(id) {
    return clients.value.find(client => client.id === id)
  }

  function searchClients(query) {
    if (!query) return clients.value
    const searchTerm = query.toLowerCase()
    return clients.value.filter(client => 
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.dni.toLowerCase().includes(searchTerm) ||
      client.phone.includes(searchTerm)
    )
  }

  return {
    clients,
    totalClients,
    activeClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    searchClients
  }
}) 