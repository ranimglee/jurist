import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "@/lib/config";

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe("/topic/admin-notifications", (message) => {
        const notif = JSON.parse(message.body);
        setNotifications((prev) => [notif, ...prev]);
      });
    };

    client.activate();

    return () => {
      client.deactivate().catch((err) => console.error("WebSocket disconnect error:", err));
    };
  }, []);

  return notifications;
}
