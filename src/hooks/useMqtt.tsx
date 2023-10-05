import mqtt, { MqttClient } from 'mqtt';
import { useEffect, useState } from 'react';

interface MqttHookOptions {
  host: string;
  port?: number;
  username?: string;
  password?: string;
  topic: string;
}

export function useMqtt(options: MqttHookOptions) {
  const { host, port = 1883, username, password, topic } = options;
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const mqttOptions: mqtt.IClientOptions = {
      host,
      port,
      username,
      password,
    };

    const mqttClient = mqtt.connect(mqttOptions);

    mqttClient.on('connect', () => {
      console.log('Conectado al servidor MQTT');
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error('Error al suscribirse al topic', err);
        }
      });
    });

    mqttClient.on('message', (mqttTopic, message) => {
      if (mqttTopic === topic) {
        const newMessage = message.toString();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient.connected) {
        mqttClient.unsubscribe(topic);
        mqttClient.end();
      }
    };
  }, [host, port, username, password, topic]);

  const publishMessage = (message: string) => {
    if (client && client.connected) {
      client.publish(topic, message);
    }
  };

  return { client, messages, publishMessage };
}
