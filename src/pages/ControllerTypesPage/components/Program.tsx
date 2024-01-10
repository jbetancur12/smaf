import { useAppSelector } from '@app/hooks/reduxHooks';
import { Save, Settings } from '@mui/icons-material';
import { Box, Grid, IconButton, Switch, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Days from './Days';
import RowComponentProgram from './RowComponentProgram';
import SettingsComponent from './SettingsComponent';

import useWebSocket from '@app/hooks/useWebSocket';
import { setParametersController } from '@app/store/slices/parametersControllerSlice';

function invertirBits(cadenaBinaria: string): string {
  return cadenaBinaria.split('').reverse().join('');
}

function Program() {
  const { socket, sendMessage, receivedMessage, isConnected } = useWebSocket(import.meta.env.VITE_MQTT); // Asegúrate de proporcionar la URL correcta.

  const { controllerTypeId, id } = useParams();
  const dispatch = useDispatch();

  const {controllerTypes} = useAppSelector((state) => state.controllerType);
  const { frame1 } = useAppSelector((state) => state.parametersController);


  const [values, setValues] = useState<Record<string, string>>({});
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [programa, setPrograma] = useState("A")

  const theme = useTheme();
  const numberOfRows = 8;
  const valveNames = [
    'V_master_1',
    'V_master_2',
    'V_master_3',
    'V_master_4',
    'Bomba 1',
    'Bomba 2',
    'Lluvia',
  ];

  const controllerTypeSelected = controllerTypes.filter((controllerType => controllerType._id === controllerTypeId))[0]

  useEffect(() => {
    if (frame1.length > 0) {

      const valveStates = frame1[19].toString(2).padStart(4, '0');
      const pumpStates = frame1[20].toString(2).padStart(2, '0');
      const rainState = frame1[21];
      const allStates = invertirBits(valveStates) + invertirBits(pumpStates) + rainState;
      const vals: { [key: string]: string } = {}

      valveNames.forEach((valve, idx) => {
        vals[valve] = allStates[idx];
      });

      setValues(vals);
    }
  }, [frame1]);

  useEffect(() => {
    if (isConnected && socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        topic: 'getParameters',
        type: 'publish',
        message: `${id}/${controllerTypeSelected.name}/program${programa}/frame1`,
      };
      sendMessage(JSON.stringify(message));
    }
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [id,  isConnected]);

  useEffect(() => {
    if (receivedMessage && socket && socket.readyState === WebSocket.OPEN) {
      const wssPayload = JSON.parse(receivedMessage);

      if (wssPayload.topic === 'sendParameters') {
        const { message } = wssPayload;
        const numeros: number[] = message.split(",").map((elemento: string) => parseInt(elemento.replace(/[" ]/g, ''), 10));
        const msg = {
          frame1: numeros,
        };

        dispatch(setParametersController(msg));
      }
    }
  }, [receivedMessage]);

  const handleSwitchToggle = (valveName:string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [valveName]: prevValues[valveName] === '1' ? '0' : '1',
    }));
  };

  const handleProgramChange = (program = '') => {
    const message = {
      topic: 'getParameters',
      type: 'publish',
      message: `${id}/${controllerTypeId}/program${program}/frame1/`,
    };
    sendMessage(JSON.stringify(message));
    setPrograma(program)
  };

  let states = [0];

  if (frame1.length > 0) {
    states = frame1[2].toString(2).padStart(8, '0');
  }

  const handleSettingsDialogOpen = () => {
    setSettingsDialogOpen(true);
  };

  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          background: 'white',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2),
        }}
      >
        <Days data={frame1.slice(0, 2)} handleChange={handleProgramChange} />
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Box>
              {frame1.length > 0 &&
                Array.from({ length: numberOfRows }).map((_, index) => (
                  <RowComponentProgram
                    key={index}
                    rowNumber={index + 1}
                    valveName={valveNames[index]}
                    minutes={frame1[3 + index]}
                    seconds={frame1[11 + index]}
                    state={states[states.length - index - 1]}
                  />
                ))}
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box display="flex" alignItems="center" flexDirection="column">
              {valveNames.map((valveName, idx) => (
                <div key={idx}>
                  <label>{valveName}</label>
                  <Switch
                    checked={values[valveName] === '1'}
                    onChange={() => handleSwitchToggle(valveName)}
                    name={valveName}
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          color: '#fff',
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            backgroundColor: values[valveName] === '1' ? 'green' : 'gray',
                          },
                        },
                      },
                    }}
                  />
                </div>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" width="100%" justifyContent="center">
          <IconButton onClick={handleSettingsDialogOpen} color="info">
            <Settings sx={{ width: 50, height: 50 }} />
          </IconButton>
          <IconButton color="success" size="large">
            <Save sx={{ width: 50, height: 50 }} />
          </IconButton>
        </Box>
      </Box>
      {isSettingsDialogOpen && <SettingsComponent isSettingsDialogOpen={isSettingsDialogOpen} handleSettingsDialogClose={handleSettingsDialogClose} />}
    </>
  );
}

export default Program;
