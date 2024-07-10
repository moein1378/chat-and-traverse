<script lang="ts" setup>
import { ref } from 'vue'

interface Message {
  id: number;
  text: string;
  state: 'sender'|'receiver';
  date: string;
}
const chatSocketUrl = import.meta.env.VITE_SOCKET_URL
const ws = new WebSocket(chatSocketUrl);
ws.addEventListener('open', function open() {
  console.log('connected');
});
ws.addEventListener('close', function close() {
  console.log('disconnected');
});
ws.addEventListener('message',(data) => {
  if(data.data && JSON.parse(data.data)){
    const temp = JSON.parse(data.data)
    temp.state = 'receiver'
    temp.date = new Date(Date.now()).toLocaleTimeString()
    setTimeout(()=>{
      messages.value.push(temp)
    },1500)
  }
});

const messages = ref<Message[]>([])
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const assignedMsg:Message = {
      id: messages.value.length + 1,
      text: newMessage.value,
      state: 'sender',
      date: new Date(Date.now()).toLocaleTimeString()
    }
    ws.send(JSON.stringify(assignedMsg));
    messages.value.push(assignedMsg)
    newMessage.value = ''
  }
}

function getMessageBoxStyle(state:'sender'|'receiver'){
  const classes = ['p-3 rounded-lg','flex flex-col']
  switch (state) {
    case 'sender':
      classes.push('bg-blue-500 text-white ml-auto items-end')
      break;
    case 'receiver':
      classes.push('bg-white text-black items-start')
      break;
  }
  return classes
}

function getMessageTimeStyle(state:'sender'|'receiver'){
  const classes = ['w-full']
  switch (state) {
    case 'sender':
      classes.push('text-start')
      break;
    case 'receiver':
      classes.push('text-end')
      break;
  }
  return classes
}
</script>
<template>
  <div class="flex flex-col h-screen bg-whatsapp-pattern">
    <div class="flex-1 overflow-y-auto p-4">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div :class="getMessageBoxStyle(message.state)" :style="{ maxWidth: '70%' }">
          {{ message.text }}
          <span :class="getMessageTimeStyle(message.state)" >{{ message.date }}</span>
        </div>
      </div>
    </div>
    <div class="bg-white p-4">
      <form @submit.prevent="sendMessage" class="flex">
        <input 
          v-model="newMessage" 
          type="text" 
          placeholder="Type a message..." 
          class="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>