import { useEffect, useState } from 'react';

interface WebSocketHook {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  receivedMessage: string;
}

function useWebSocket(url: string): WebSocketHook {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [receivedMessage, setReceivedMessage] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {

      setReceivedMessage(event.data);
    };

    setSocket(ws);

    return () => {
      if(ws.readyState === WebSocket.OPEN){
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.send(message);
    }
  };

  return { socket, isConnected, sendMessage, receivedMessage };
}

export default useWebSocket;
