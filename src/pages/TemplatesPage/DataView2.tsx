import { getTemplate } from '@app/api/template.api';
import { Sensor, VariableData } from '@app/api/variable.api';

import useWebSocket from '@app/hooks/useWebSocket';
import { Sensors } from '@mui/icons-material';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DataView from './DataView';
import Actuators from './components/Actuators';

function formatDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return formattedDate
}

export default function IconLabelTabs() {

  const { socket, isConnected, sendMessage, receivedMessage } = useWebSocket('wss://api.smaf.com.co');

  let [searchParams] = useSearchParams()

  const [value, setValue] = useState(0);
  const [variables, setVariables] = useState<VariableData[]>([])
  const [ai, setAi] = useState<Sensor[]>([])
  const [mqttDataObj, setMqttDataObj] = useState<any>({})
  const [mqttInputObj, setMqttInputObj] = useState<any>({ 0: '0,0' })
  const [isMessageSent, setMessageSent] = useState(false);



  const templateId = searchParams.get('template')
  const customerId = searchParams.get('customer')
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTemplate(templateId).then((data) => {
      setVariables(data.variables)
      const analogInputs = data.variables.filter(
        (obj) => obj.typePin === 'analogInput'
      )
      setAi(analogInputs as Sensor[])
    })

    return () => { }
  }, [])

  useEffect(() => {
    if (isConnected && !isMessageSent && socket) {
      socket.onopen = () => {
        const message = {
          topic: 'input',
          type: 'publish',
          message: `${customerId}/${templateId}/0/0/update`,
        };
        socket.send(JSON.stringify(message));
        setMessageSent(true);
      };
    }
  }, [isConnected, customerId, templateId, socket, isMessageSent]);


  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const wssPayload = JSON.parse(event.data);

        if (wssPayload.topic === 'sensor') {
          const data = wssPayload.message.split('/');
          if (data[1] === templateId) {
            setMqttDataObj((prevData: any) => ({
              ...prevData,
              [data[3]]: { value: data[4], date: formatDateTime(new Date()) },
            }));
          }
        }

        if (wssPayload.topic === 'output') {
          const data = wssPayload.message.split('/');
          if (data[1] === templateId) {
            setMqttInputObj((prevData: any) => ({
              ...prevData,
              [data[3]]: data[4],
            }));
          }
        }
      };

      if (socket.readyState === WebSocket.OPEN) {
        const message = {
          topic: 'input',
          type: 'publish',
          payload: `${customerId}/${templateId}/0/0/update`,
        };
        socket.send(JSON.stringify(message));
      }

    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socket]);


  const outputs = variables.filter((obj) => obj.typePin === 'digitalOutput')

  const handleOutput = (vp?: number, msg?: string) => {

    const message = {
      topic: 'input',
      type: "publish",
      message: `${customerId}/${templateId}/${Date.now()}/${vp}/${msg}`
    }

    sendMessage(JSON.stringify(message))


  }

  return (
    <>

      <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
        <Tab icon={<SsidChartIcon />} />
        <Tab icon={<Sensors />} />
      </Tabs>
      {value === 0 && (
        <DataView ai={ai} templateId={templateId} variables={variables} mqtt={mqttDataObj} />
      )}
      {value === 1 && (
        <Actuators outputs={outputs} states={mqttInputObj} handleOutput={handleOutput} />
      )}
    </>
  );
}


