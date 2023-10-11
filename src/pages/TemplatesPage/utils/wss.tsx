import { useEffect, useState } from 'react';

const Wss = () => {
  const [mqttData, setMqttData] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // Reemplaza con la dirección de tu servidor Express

    ws.onopen = () => {
      console.log('Conectado al servidor WebSocket');
    };

    ws.onmessage = (event) => {
    //  console.log("🚀 ~ file: wss.tsx:14 ~ useEffect ~ event:", JSON.parse(event.data))
     if(JSON.parse(event.data).message.includes("579/0/6")){
      console.log(JSON.parse(event.data), (new Date()).toLocaleString())
     }
      setMqttData(event.data); // Actualizar el estado de React con los datos MQTT
    };

    return () => {
      ws.close(); // Cerrar la conexión al desmontar el componente
    };
  }, []);

  return (
    <div>
      <h1>Mensaje MQTT:</h1>
      <p>{mqttData}</p>
    </div>
  );
};

export default Wss;