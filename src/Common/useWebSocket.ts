import { ref } from 'vue'

export interface MessageSend {
  to: string
  content: string
  from?: string
  groupId?: string
  timestamp: string
}

export function useWebSocket(baseUrl: string, clientId: string) {
  const socket = ref<WebSocket | null>(null)
  const messages = ref<MessageSend[]>([])
  const connected = ref(false) // Trạng thái kết nối WebSocket
  const notifications = ref<string[]>([]) // Dành cho thông báo

  const sendMessage = (to: string, content: string, type: string, groupId?: string) => {
    // Kiểm tra trạng thái WebSocket trước khi gửi
    if (socket.value?.readyState === WebSocket.OPEN && content.trim()) {
      const timestamp = new Date().toISOString() // thời gian hiện tại dạng ISO
      const payload = { to, content, type, timestamp }

      console.log('🔜 Đã gửi tin nhắn:', payload)
      socket.value.send(JSON.stringify(payload))
    }
    else {
      console.warn('⚠️ Không thể gửi tin nhắn. WebSocket không mở hoặc không kết nối.')
    }
  }

  const connect = () => {
    const url = `${baseUrl}?id=${encodeURIComponent(clientId)}`

    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      console.log('🔌 Đã kết nối WebSocket với ID:', clientId)
      connected.value = true
    }

    socket.value.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'chat')
          messages.value.push(data)

        // messages.value.push(`${data.from}: ${data.content}:${data.timestamp}`)
        else if (data.type === 'notification')
          notifications.value.push(`${data.from}: ${data.content}:${data.timestamp}`) // Lưu thông báo

        console.log(data)
      }
      catch (error) {
        messages.value.push(event.data)
      }
    }

    socket.value.onclose = event => {
      console.log('❌ WebSocket đã đóng', event)
      connected.value = false
    }

    socket.value.onerror = (error: Event) => {
      console.error('⚠️ Lỗi WebSocket:', error)
      connected.value = false
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      connected.value = false
    }
  }

  return {
    messages,
    notifications,
    sendMessage,
    connect,
    disconnect,
    connected, // Trạng thái kết nối
  }
}
