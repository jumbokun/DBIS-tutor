import axios from 'axios'

const instance = axios.create({
  baseURL: '/api'
})

export async function fetchConversations() {
  const res = await instance.get('/conversations')
  return res.data
}

export async function createConversation(messages) {
  const res = await instance.post('/conversation', messages)
  return res.data
}

export async function addMessageToConversation(convId, message) {
  const res = await instance.post(`/conversation/${convId}`, message)
  return res.data
}
