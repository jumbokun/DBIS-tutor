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

export async function sendMessageToBackend(userMessage) {
  // Example: Always use conversation_id = 1
  const payload = {
    conversation_id: 1,
    user_message: userMessage
  };
  const response = await axios.post('http://localhost:7888/chat', payload);
  // The server returns { "assistant_reply": "...some text..." }
  return response.data.assistant_reply;
}