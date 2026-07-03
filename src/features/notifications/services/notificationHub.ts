import * as signalR from '@microsoft/signalr'
import { tokenStorage } from '@/features/auth/utils/token'

const HUB_URL = `${import.meta.env.VITE_API_URL.slice(0, -4)}/hubs/notifications`

// Singleton connection — dùng chung toàn app
let connection: signalR.HubConnection | null = null

export const notificationHub = {
  getConnection(): signalR.HubConnection {
    if (!connection) {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          // Đính kèm accessToken vào mỗi request SignalR
          accessTokenFactory: () => tokenStorage.getAccess() ?? '',
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(
          import.meta.env.DEV
            ? signalR.LogLevel.Information
            : signalR.LogLevel.Error
        )
        .build()
    }
    return connection
  },

  async start(): Promise<void> {
    const conn = notificationHub.getConnection()
    if (conn.state === signalR.HubConnectionState.Disconnected) {
      await conn.start()
    }
  },

  async stop(): Promise<void> {
    if (connection?.state === signalR.HubConnectionState.Connected) {
      await connection.stop()
    }
    connection = null
  },

  onReceive(handler: (notification: unknown) => void): () => void {
    const conn = notificationHub.getConnection()
    conn.on('ReceiveNotification', handler)
    // Trả về cleanup function
    return () => conn.off('ReceiveNotification', handler)
  },
}
