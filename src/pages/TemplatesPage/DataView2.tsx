import { getTemplate } from '@app/api/template.api';
import { Sensor, VariableData } from '@app/api/variable.api';
import mqttHook from '@app/hooks/mqttHook';
import { Sensors } from '@mui/icons-material';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { QoS } from 'mqtt';
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

  let [searchParams] = useSearchParams()

  const [value, setValue] = useState(0);
  const [variables, setVariables] = useState<VariableData[]>([])
  const [ai, setAi] = useState<Sensor[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [mqttDataObj, setMqttDataObj] = useState<any>({})
  // console.log("🚀 ~ file: DataView2.tsx:35 ~ IconLabelTabs ~ mqttDataObj:", mqttDataObj)
  const [mqttInputObj, setMqttInputObj] = useState<any>({ 0: '0,0' })
  //console.log("🚀 ~ file: DataView2.tsx:38 ~ IconLabelTabs ~ mqttInputObj:", mqttInputObj)
  const {
    client,
    isSubed,
    payload,
    connectStatus,
    mqttConnect,
    mqttDisconnect,
    mqttPublish,
    mqttSub,
    mqttUnSub
  } = mqttHook()

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
    const protocol = 'wss'
    const host = 'mqtt.smaf.com.co'
    const port = 8081
    const clientId = 'emqx_react_' + Math.random().toString(16).substring(2, 8)
    const username = 'smaf'
    const password = 'smaf310'

    const url = `${protocol}://${host}:${port}`

    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000 // ms
    }

    mqttConnect(url, options)

    return () => {
      mqttDisconnect()
    }
  }, [])

useEffect(() => {
  if (connectStatus === 'Connected' && !isSubscribed) {
    const subscription = {
      topic: ['sensor', 'output'],
      qos: 0 as QoS
    }
    const context = {
      topic: 'input',
      qos: 0 as QoS,
      payload: `${customerId}/${templateId}/0/0/update`
    }

    mqttSub(subscription)
    mqttPublish(context)
    setIsSubscribed(true)
  }
}, [connectStatus, isSubscribed])

useEffect(() => {
  console.log("🚀 ~ file: DataView2.tsx:118 ~ useEffect ~ data:", payload)
  if (payload.topic === 'sensor') {
    const data = payload.message.toString().split('/')
    if (data[1] === templateId) {
      setMqttDataObj((prevData: any) => ({
        ...prevData,
        [data[3]]: { value: data[4], date: formatDateTime(new Date()) }
      }))
    }
  }

  if (payload.topic === 'output') {
    const data = payload.message.toString().split('/')
    console.log("🚀 ~ file: DataView2.tsx:128 ~ useEffect ~ data:", data)
    if (data[1] === templateId) {
      setMqttInputObj((prevData: any) => ({
        ...prevData,
        [data[3]]: data[4]
      }))
    }
  }
}, [payload.topic, payload.message, templateId])

const outputs = variables.filter((obj) => obj.typePin === 'digitalOutput')

const handleOutput = (vp?: number, msg?: string) => {
  const context = {
    topic: 'input',
    qos: 0 as QoS,
    payload: `${customerId}/${templateId}/${Date.now()}/${vp}/${msg}`
  }
  console.log("🚀 ~ file: DataView2.tsx:147 ~ handleOutput ~ context:", context)


  mqttPublish(context)
}

  return (
    <>
    <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
      <Tab icon={<SsidChartIcon />} />
      <Tab icon={<Sensors />} />
    </Tabs>
    {value === 0 && (
      <DataView ai={ai} templateId={templateId} variables={variables} mqtt={mqttDataObj}/>
    )}
    {value === 1 && (
      <Actuators outputs={outputs} states={mqttInputObj} handleOutput={handleOutput}/>
    )}
    </>
  );
}