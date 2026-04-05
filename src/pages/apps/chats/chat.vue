<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { MessageSend } from '@/Common/useWebSocket'
import { useWebSocket } from '@/Common/useWebSocket'

const clientId = ref('')
const connected = ref(false)
const receiverId = ref('')
const message = ref('')
const messages = ref<MessageSend[]>([])
const notifications = ref<string[]>([])

let sendMessage = (to: string, content: string, type: string, groupId?: string) => { }
let disconnect = () => { }

const connect = () => {
  if (!clientId.value.trim())
    return

  const socket = useWebSocket('wss://localhost:44345/ws', clientId.value)

  socket.connect()
  messages.value = socket.messages.value
  notifications.value = socket.notifications.value
  sendMessage = socket.sendMessage
  disconnect = socket.disconnect
  connected.value = true
}

const send = (groupId?: string) => {
  if (groupId != null) {
    if (!receiverId.value.trim() || !message.value.trim())
      return

    sendMessage(receiverId.value, message.value, 'chat', groupId)
    messages.value.push({ from: receiverId.value, to: '', content: message.value } as MessageSend)
    message.value = ''
  }
  else {
    if (!receiverId.value.trim() || !message.value.trim())
      return

    sendMessage(receiverId.value, message.value, 'chat')
    messages.value.push({ from: receiverId.value, to: '', content: message.value } as MessageSend)
    message.value = ''
  }
}

const sendNotification = () => {
  if (!receiverId.value.trim() || !message.value.trim())
    return

  sendMessage(receiverId.value, message.value, 'notification')
  notifications.value.push(`Bạn -> ${receiverId.value}: ${message.value}`)
  message.value = ''
}

onBeforeUnmount(() => {
  disconnect()
})
</script>

<template>
  <div class="p-4 max-w-xl mx-auto">
    <template v-if="!connected">
      <h2 class="text-lg font-bold mb-2">
        Đăng ký người dùng
      </h2>
      <input
        v-model="clientId"
        placeholder="Nhập ID của bạn"
        class="border p-2 mr-2 w-full mb-2"
      >
      <button
        class="bg-green-500 text-white px-4 py-2 rounded w-full"
        @click="connect"
      >
        Kết nối
      </button>
    </template>

    <template v-else>
      <h2 class="text-xl font-bold mb-4">
        Chat WebSocket
      </h2>

      <div class="mb-2">
        <input
          v-model="receiverId"
          placeholder="Gửi đến ID nào?"
          class="border p-2 w-full"
        >
      </div>

      <form
        class="mb-4 flex"
        @submit.prevent="send"
      >
        <input
          v-model="message"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="border p-2 flex-1 mr-2"
        >
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Gửi
        </button>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded"
          @click="sendNotification"
        >
          Gửi notification
        </button>
      </form>

      <!-- Phần chat -->
      <div class="bg-gray-100 p-4 rounded shadow max-h-64 overflow-auto">
        <h3 class="font-semibold mb-2">
          Tin nhắn nhận được:
        </h3>
        <ul>
          <li
            v-for="(msg, index) in messages"
            :key="index"
          >
            {{ msg }}
          </li>
        </ul>
      </div>

      <!-- Phần thông báo -->
      <div class="bg-yellow-100 p-4 rounded shadow mt-4 max-h-64 overflow-auto">
        <h3 class="font-semibold mb-2">
          Thông báo:
        </h3>
        <ul>
          <li
            v-for="(notification, index) in notifications"
            :key="index"
          >
            {{ notification }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
