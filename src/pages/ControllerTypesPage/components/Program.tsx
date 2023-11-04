
import { useAppSelector } from '@app/hooks/reduxHooks';
import useWebSocket from '@app/hooks/useWebSocket';
import { setParametersController } from '@app/store/slices/parametersControllerSlice';
import { ExitToApp, Save } from '@mui/icons-material';
import { Box, Grid, IconButton, Switch, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Days from './Days';
import RowComponent from './RowComponentProgram';

interface Props {
  handleProgramDialogClose: () => void
}

const Program: React.FC<Props> = ({ handleProgramDialogClose }) => {

  const { socket } = useWebSocket(import.meta.env.VITE_MQTT);
  const { controllerTypeId, id } = useParams();
  const dispatch = useDispatch();

  const { controllerTypes } = useAppSelector((state) => state.controllerType)
  const { frame1 } = useAppSelector((state) => state.parametersController)


  const [values, setValues] = useState<Record<string, string>>({});
  const [colorValues, setColorValues] = useState<Record<string, string>>({});

  const theme = useTheme()
  const numberOfRows = 8;
  const valveNames = ["V_master_1", "V_master_2", "V_master_3", "V_master_4", "Bomba 1", "Bomba 2", "Lluvia"]

  const controllerTypeSelected = controllerTypes.filter((controllerType => controllerType._id === controllerTypeId))[0]



  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        // Configura el WebSocket
        const message = {
          topic: 'getParameters',
          type: 'publish',
          message: `${id}/${controllerTypeSelected.name}/programA/frame1`,
        };
        socket.send(JSON.stringify(message));
      };
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      // Realiza las operaciones que deseas cuando isTimesDialogOpen es true

      socket.onmessage = (event: MessageEvent<any>) => {
        const wssPayload = JSON.parse(event.data);


        if (wssPayload.topic === 'sendParameters') {
          const {message} = wssPayload
          const numeros: number[] = message.split(",").map((elemento:string) => parseInt(elemento.replace(/[" ]/g, ''), 10));

          const msg = {
            [`frame1`]: numeros
          }


          dispatch(setParametersController(msg))
        }

      };

      if (socket.readyState === WebSocket.OPEN) {
        const message = {
          topic: 'getParameters',
          type: 'publish',
          message: `${id}/${controllerTypeId}/programA/frame1/`,
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



  const handleSwitchToggle = (valveName: string) => {
    // Update the state for the specific switch
    setValues((prevValues) => ({
      ...prevValues,
      [valveName]: !prevValues[valveName] ? '1' : '0',
    }));
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (value == "0") {
      setColorValues({
        ...colorValues, [name]: "gray"
      })
    } else {
      setColorValues({
        ...colorValues, [name]: "green"
      })
    }
  }

  return (
    <Box sx={
      {
        background: "white",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2),
      }
    }
    >
      <Days data={frame1.slice(0, 2)}/>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Box>
            {Array.from({ length: numberOfRows }).map((_, index) => (
              <RowComponent
                key={index}
                rowNumber={index + 1}
                valveName={valveNames[index]}
              />
            ))}
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box display="flex" alignItems="center" flexDirection={"column"}>
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
      <Box display="flex" width="100%" justifyContent="end">
      <IconButton >
        <Save />
      </IconButton>
      <IconButton onClick={handleProgramDialogClose}>
        <ExitToApp />
      </IconButton>
      </Box>
    </Box>
  );
}

export default Program;