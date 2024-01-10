import { useAppSelector } from "@app/hooks/reduxHooks";
import useWebSocket from "@app/hooks/useWebSocket";
import { useNotification } from "@app/services/notificationService";
import { setParametersController } from "@app/store/slices/parametersControllerSlice";
import { ExitToApp, Save } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";




interface TimesComponentProgramProps {
  rowNumber: number;
  isTimesDialogOpen: boolean; // Propiedad pasada al componente
  handleTimesDialogClose: () => void;
}

const TimesComponentProgram: React.FC<TimesComponentProgramProps> = ({ rowNumber, isTimesDialogOpen, handleTimesDialogClose }) => {
  const dispatch = useDispatch();
  const { socket, isConnected, sendMessage, receivedMessage } = useWebSocket(import.meta.env.VITE_MQTT);
  const { controllerTypeId, id } = useParams();
  const { frame2, program } = useAppSelector((state) => state.parametersController)

  const { controllerTypes } = useAppSelector((state) => state.controllerType)


  const { success } = useNotification()

  const theme = useTheme()
  const [colorValues, setColorValues] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [valvesStates, setValvesStates] = useState("0")


  const controllerTypeSelected = controllerTypes.filter((controllerType => controllerType._id === controllerTypeId))[0]


  useEffect(() => {
    if (isConnected && socket && socket.readyState === WebSocket.OPEN) {

        // Configura el WebSocket
        const message = {
          topic: 'getParameters',
          type: 'publish',
          message: `${id}/${controllerTypeSelected.name}/program${program}/frame2/${rowNumber}`,
        };
        sendMessage(JSON.stringify(message));

    }
  }, [id, rowNumber, isConnected]);


  useEffect(() => {
    if (receivedMessage && socket && socket.readyState === WebSocket.OPEN) {
      // Realiza las operaciones que deseas cuando isTimesDialogOpen es true

      const wssPayload = JSON.parse(receivedMessage)


        if (wssPayload.topic === 'sendParameters') {
          const {message} = wssPayload
          const numeros: number[] = message.split(",").map((elemento:string) => parseInt(elemento.replace(/[" ]/g, ''), 10));

          const msg = {
            [`frame2`]: numeros
          }


          dispatch(setParametersController(msg))
        }

    }

  }, [receivedMessage]);



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (values[name] == "0") {
      setColorValues({
        ...colorValues, [name]: "gray"
      })
    } else {
      setColorValues({
        ...colorValues, [name]: "green"
      })
    }
  }

  const handleTimesDialogSave = () => {

    const valveStatesToBinary = parseInt(valvesStates, 2)

    const valvesTimes = Object.values(values)

    const valuesToSend = `${rowNumber},${valveStatesToBinary},${valvesTimes}`

    const message = {
      topic: 'postParameters',
      type: 'publish',
      message: `${id}/${controllerTypeId}/programA/frame2/${valuesToSend.replace(/"/g, '')}`,
    };

    socket?.send(JSON.stringify(message));

    success("Parametros enviados al controlador");



    handleTimesDialogClose()

  }
  useEffect(() => {
    const objeto: { [key: string]: string } = {};
    const colors: { [key: string]: string } = {};

    // console.log("🚀 ~ file: TimesComponentProgram.tsx:155 ~ frame2.forEach ~ frame2:", frame2)
    frame2.forEach((element, idx) => {
      if (idx > 1) {
        objeto[`output${idx - 2}`] = element;
      }
    });




    const claves = Object.keys(objeto);
    for (const clave of claves) {


      if (objeto[clave] == "0") {
        colors[clave] = "gray"
      } else {
        colors[clave] = "green"
      }
    }

    const _valvesStates: string = frame2[1]?.toString(2).padStart(40, '0') || "0"

    setValvesStates(_valvesStates)


    for (let i = _valvesStates.length - 1; i >= 0; i--) {
      const valveState = _valvesStates[i];
      colors[`output${_valvesStates.length - i - 1}`] = valveState === "0" ? "gray" : "green";
    }

    // _valvesStates.forEach((valveState:string, idx: number) => {

    //   valveState == "0" ? colors[`output${idx}`] = "gray" : colors[`output${idx}`] = "gray"
    // });





    setValues(objeto)
    setColorValues(colors)
  }, [frame2])



  const handleOnClick = (index: number) => {
    const newIndex = valvesStates.length - index - 1
    if (index >= 0 && index < valvesStates.length) {
      const valveState = valvesStates[newIndex] === "0" ? "1" : "0";
      const updatedValvesStates = valvesStates.substring(0, newIndex) + valveState + valvesStates.substring(newIndex + 1);
      setValvesStates(updatedValvesStates);

      // Actualiza el color del botón
      const buttonColor = valveState === "0" ? "gray" : "green";
      setColorValues({ ...colorValues, [`output${index}`]: buttonColor });
    }
  }

  const styles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta la opacidad aquí (0.5 es 50% de opacidad)
    zIndex: 9998, // Coloca el fondo detrás del modal
  };

  return (
    <Box sx={styles} id="times">
      <Box sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        padding: theme.spacing(2),
        background: 'white',
        // borderRadius: 8,
        boxShadow: theme.shadows[5],
        display: isTimesDialogOpen ? 'flex' : 'none',
        flexDirection: "column",
        alignItems: "center",
        // width:"100%"
      }} >
        {/* <Paper> */}
        <Typography variant="h5">Este es un modal personalizado</Typography>
        <Grid container spacing={2} className="tw-mt-0">

          {Array.from({ length: 40 }).map((_, index) => (
            <Grid item  lg={3} md={4} sm={6} xs={12} key={index}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Button
                  // size="small"
                  onClick={() => handleOnClick(index)}
                  sx={{
                    background: colorValues[`output${index}`] || "gray",
                    marginRight: 5,
                    // textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "calc(100% - 10px)",
                    "& .MuiButtonBase-root": {
                      minWidth: 30
                    }
                  }}
                >

                  {index}
                </Button>
                <TextField
                  name={`output${index}`}
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleInputChange}
                  value={values[`output${index}`] || 0}
                  sx={
                    {
                      maxWidth: 80
                    }
                  }
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" width="100%" justifyContent="end" marginTop={4}>
        <IconButton onClick={handleTimesDialogSave} color="success">
          <Save  sx={{width: 40, height:40}}/>
        </IconButton>
        <IconButton onClick={handleTimesDialogClose}>
          <ExitToApp  sx={{width: 40, height:40}}/>
        </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default TimesComponentProgram
