import { getTemplate } from "@app/api/template.api";
import { Sensor, VariableData } from "@app/api/variable.api";

import useWebSocket from "@app/hooks/useWebSocket";
import { setController } from "@app/store/slices/controllerSlice";
import { Sensors } from "@mui/icons-material";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import DataView from "./DataView";
import Actuators from "./components/Actuators";

function formatDateTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export default function IconLabelTabs() {
  const { socket, isConnected } = useWebSocket(import.meta.env.VITE_MQTT);
  const dispatch = useDispatch();
  if (socket) {
    socket.onopen = () => {
      const message = {
        topic: "input",
        type: "publish",
        message: `${customerKey || customerId}/${
          templateKey || templateId
        }/0/0/update`,
      };
      socket.send(JSON.stringify(message));
      setMessageSent(true);
    };
  }

  let [searchParams] = useSearchParams();

  const [value, setValue] = useState(0);
  const [variables, setVariables] = useState<VariableData[]>([]);
  const [ai, setAi] = useState<Sensor[]>([]);
  const [mqttDataObj, setMqttDataObj] = useState<any>({});
  const [mqttInputObj, setMqttInputObj] = useState<any>({ 40: "0,0" });
  // const [status, setStatus] = useState({});
  const [isMessageSent, setMessageSent] = useState(false);

  const templateId = searchParams.get("template");
  const customerId = searchParams.get("customer");
  const templateKey =
    searchParams.get("templateKey") === "undefined"
      ? templateId
      : searchParams.get("templateKey");
  const customerKey =
    searchParams.get("customerKey") === "undefined"
      ? customerId
      : searchParams.get("customerKey");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTemplate(templateId).then((data) => {
      setVariables(data.variables);
      const analogInputs = data.variables.filter(
        (obj) => obj.typePin === "analogInput"
      );
      setAi(analogInputs as Sensor[]);
    });

    return () => {};
  }, []);

  useEffect(() => {
    if (isConnected && !isMessageSent && socket) {
      socket.onopen = () => {
        const message = {
          topic: "input",
          type: "publish",
          message: `${customerKey || customerId}/${
            templateKey || templateId
          }/0/0/update`,
        };
        socket.send(JSON.stringify(message));
        setMessageSent(true);
      };
    }
  }, [
    isConnected,
    customerId,
    templateId,
    socket,
    isMessageSent,
    socket?.onopen,
  ]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const wssPayload = JSON.parse(event.data);

        if (wssPayload.topic === "sensor") {
          const data = wssPayload.message.split("/");

          if (data[1] === templateKey) {
            setMqttDataObj((prevData: any) => ({
              ...prevData,
              [data[3]]: { value: data[4], date: formatDateTime(new Date()) },
            }));
          }
        }

        if (wssPayload.topic === "controllerStatusChange") {
          dispatch(setController(wssPayload.message));
        }

        if (wssPayload.topic === "output") {
          const data = wssPayload.message.split("/");
          if (data[1] === templateKey) {
            setMqttInputObj((prevData: any) => ({
              ...prevData,
              [data[3]]: data[4],
            }));
          }
        }
      };

      if (socket.readyState === WebSocket.OPEN) {
        const message = {
          topic: "input",
          type: "publish",
          payload: `${customerKey || customerId}/${
            templateKey || templateId
          }/0/0/update`,
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

  const outputs = variables.filter((obj) => obj.typePin === "digitalOutput");

  const handleOutput = (vp?: number, msg?: string) => {
    const message = {
      topic: "input",
      type: "publish",
      message: `${customerKey || customerId}/${
        templateKey || templateId
      }/${Date.now()}/${vp}/${msg}`,
    };

    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    }
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
      >
        <Tab icon={<SsidChartIcon />} />
        <Tab icon={<Sensors />} />
      </Tabs>
      {value === 0 && (
        <DataView
          ai={ai}
          templateId={templateId}
          variables={variables}
          mqtt={mqttDataObj}
        />
      )}
      {value === 1 && (
        <Actuators
          outputs={outputs}
          states={mqttInputObj}
          handleOutput={handleOutput}
        />
      )}
    </>
  );
}
