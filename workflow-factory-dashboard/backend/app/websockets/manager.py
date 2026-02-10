"""WebSocket connection manager for real-time updates."""
import json
from typing import Dict, Set, List


class ConnectionManager:
    def __init__(self):
        self.active_connections: List = []
        self.subscriptions: Dict[str, Set] = {}

    async def connect(self, websocket):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")

    async def disconnect(self, websocket):
        """Remove a WebSocket connection."""
        self.active_connections.remove(websocket)
        
        # Remove from all subscriptions
        for channel in list(self.subscriptions.keys()):
            self.subscriptions[channel].discard(websocket)
            if not self.subscriptions[channel]:
                del self.subscriptions[channel]
        
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    def subscribe(self, websocket, channel: str):
        """Subscribe a connection to a channel."""
        if channel not in self.subscriptions:
            self.subscriptions[channel] = set()
        self.subscriptions[channel].add(websocket)
        print(f"Client subscribed to {channel}")

    def unsubscribe(self, websocket, channel: str):
        """Unsubscribe a connection from a channel."""
        if channel in self.subscriptions:
            self.subscriptions[channel].discard(websocket)
            if not self.subscriptions[channel]:
                del self.subscriptions[channel]
        print(f"Client unsubscribed from {channel}")

    async def broadcast(self, message: dict, channel: str = None):
        """Broadcast a message to subscribed clients."""
        if channel and channel in self.subscriptions:
            # Send to specific channel subscribers
            for connection in self.subscriptions[channel]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception as e:
                    print(f"Error sending message: {e}")
        else:
            # Broadcast to all connections
            for connection in self.active_connections:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception as e:
                    print(f"Error sending message: {e}")


# Global connection manager
manager = ConnectionManager()
