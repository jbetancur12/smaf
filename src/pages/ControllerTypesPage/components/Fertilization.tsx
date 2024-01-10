import { useAppSelector } from "@app/hooks/reduxHooks";
import useWebSocket from "@app/hooks/useWebSocket";
import { setParametersController } from "@app/store/slices/parametersControllerSlice";
import { ExitToApp, Save } from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Switch,
  TextField,
  useTheme,
} from "@mui/material";
// import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

interface FertilizationProgramProps {
  rowNumber: number;
  isFertilizationDialogOpen: boolean; // Propiedad pasada al componente
  handleFertilizationDialogClose: () => void;
}

const Fertilization: React.FC<FertilizationProgramProps> = ({
  rowNumber,
  isFertilizationDialogOpen,
  handleFertilizationDialogClose,
}) => {
  const { socket, isConnected, sendMessage, receivedMessage } = useWebSocket(
    import.meta.env.VITE_MQTT
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const { frame3, program } = useAppSelector(
    (state) => state.parametersController
  );
  const { controllerTypes } = useAppSelector((state) => state.controllerType);
  const { controllerTypeId, id } = useParams();

  const styles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta la opacidad aquí (0.5 es 50% de opacidad)
    zIndex: 9998, // Coloca el fondo detrás del modal
  };

  const controllerTypeSelected = controllerTypes.filter(
    (controllerType) => controllerType._id === controllerTypeId
  )[0];

  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    lunes: false,
    martes: false,
    miércoles: false,
    jueves: false,
    viernes: false,
    sábado: false,
    domingo: false,
  });

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  // const [, setFillingAndPressureTime] = useState<null | Dayjs>(
  //   dayjs("00:00", "HH:mm")
  // );
  // const [, setAdvanceTime] = useState<null | Dayjs>(dayjs("00:00", "HH:mm"));

  // const [, setShakerTime] = useState<null | Dayjs>(dayjs("00:00", "HH:mm"));

  const [values, setValues] = useState<Record<string, string>>({});

  const [tanqueCheckboxes, setTanqueCheckboxes] = useState<
    Record<string, boolean>
  >({});

  const [isBoosterOn, setIsBoosterOn] = useState(false);
  const [isAgitatorOn, setIsAgitatorOn] = useState(false);

  const handleBoosterSwitchToggle = () => {
    setIsBoosterOn(!isBoosterOn);
  };

  // Handler for the "Agitator" switch
  const handleAgitatorSwitchToggle = () => {
    setIsAgitatorOn(!isAgitatorOn);
  };

  const handleFertilizationDialogSave = () => {};

  const handleDayToggle = (day: string) => {
    const clone = { ...selectedDays, [day]: !selectedDays[day] };
    setSelectedDays(clone);
  };

  const handleSwitchToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  // const handleFillingAndPressureTimeChange = (newTime: Dayjs | null) => {
  //   setFillingAndPressureTime(newTime);
  // };

  // const handleAdvanceTimeChange = (newTime: Dayjs | null) => {
  //   setAdvanceTime(newTime);
  // };

  // const handleShakerTimeChange = (newTime: Dayjs | null) => {
  //   setShakerTime(newTime);
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleTanqueCheckboxToggle = (tanque: string) => {
    setTanqueCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [tanque]: !prevCheckboxes[tanque],
    }));
  };

  const generateTanqueCheckboxes = () => {
    const tanqueCheckboxesArray = [];
    for (let i = 1; i <= 8; i++) {
      const tanque = `T${i}`;
      tanqueCheckboxesArray.push(
        <label key={tanque}>
          <input
            type="checkbox"
            checked={tanqueCheckboxes[tanque]}
            onChange={() => handleTanqueCheckboxToggle(tanque)}
          />
          {tanque}
        </label>
      );
    }
    return tanqueCheckboxesArray;
  };

  useEffect(() => {
    if (isConnected && socket && socket.readyState === WebSocket.OPEN) {
      // Configura el WebSocket
      const message = {
        topic: "getParameters",
        type: "publish",
        message: `${id}/${controllerTypeSelected.name}/program${program}/frame3/${rowNumber}`,
      };
      sendMessage(JSON.stringify(message));
    }
  }, [id, rowNumber, isConnected]);

  useEffect(() => {
    if (receivedMessage && socket && socket.readyState === WebSocket.OPEN) {
      // Realiza las operaciones que deseas cuando isTimesDialogOpen es true

      const wssPayload = JSON.parse(receivedMessage);

      if (wssPayload.topic === "sendParameters") {
        const { message } = wssPayload;
        const numeros: number[] = message
          .split(",")
          .map((elemento: string) =>
            parseInt(elemento.replace(/[" ]/g, ""), 10)
          );

        const msg = {
          [`frame3`]: numeros,
        };

        dispatch(setParametersController(msg));
      }
    }
  }, [receivedMessage]);

  useEffect(() => {
    if (frame3.length > 0) {
      const valveStates = frame3[0].toString(2).padStart(8, "0");
      setIsSwitchOn(valveStates[valveStates.length - rowNumber] == "1");
      const binaryString = frame3[1].toString(2).padStart(7, "0");
      const days = Object.keys(selectedDays);
      days.forEach((day, index) => {
        setSelectedDays((prevSelectedDays) => ({
          ...prevSelectedDays,
          [day]: binaryString[index] === "1",
        }));
      });
      const pumpStates = frame3[9].toString(2).padStart(8, "0");
      setIsBoosterOn(pumpStates[pumpStates.length - rowNumber] == "1");
      const shakerStates = frame3[10].toString(2).padStart(8, "0");
      setIsBoosterOn(shakerStates[shakerStates.length - rowNumber] == "1");
      setValues({
        fillingAndPressureTime: frame3[12 + rowNumber],
        shakerTime: frame3[20 + rowNumber],
        advanceTime: frame3[28 + rowNumber],
      });
    }
  }, [frame3]);

  return (
    <Box sx={styles} id="times">
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          padding: theme.spacing(2),
          background: "white",
          // borderRadius: 8,
          boxShadow: theme.shadows[5],
          display: isFertilizationDialogOpen ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          // width:"100%"
        }}
      >
        <Grid container>
          <Box id="2">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              id="1"
              className="tw-mb-4"
            >
              <Box>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.lunes}
                    onChange={() => handleDayToggle("lunes")}
                  />
                  L
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.martes}
                    onChange={() => handleDayToggle("martes")}
                  />
                  M
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.miércoles}
                    onChange={() => handleDayToggle("miércoles")}
                  />
                  X
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.jueves}
                    onChange={() => handleDayToggle("jueves")}
                  />
                  J
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.viernes}
                    onChange={() => handleDayToggle("viernes")}
                  />
                  V
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.sábado}
                    onChange={() => handleDayToggle("sábado")}
                  />
                  S
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDays.domingo}
                    onChange={() => handleDayToggle("domingo")}
                  />
                  D
                </label>
              </Box>
              <Box>
                <label>On/Off</label>
                <Switch
                  checked={isSwitchOn}
                  onChange={handleSwitchToggle}
                  name="switch"
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      "&.Mui-checked": {
                        color: "#fff",
                        "& + .MuiSwitch-track": {
                          opacity: 1,
                          backgroundColor: isSwitchOn ? "green" : "gray",
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className="tw-mb-2 tw-gap-3"
              >
                <label>Llenado y la presurizacion (Sec)</label>
                <TextField
                  name="fillingAndPressureTime"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleInputChange}
                  value={values[`fillingAndPressureTime`] || 0}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className="tw-mb-2 tw-gap-3"
              >
                <label>Tiempo de Avance (Sec)</label>
                <TextField
                  name="advanceTime"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleInputChange}
                  value={values[`advanceTime`] || 0}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className="tw-mb-2 tw-gap-3"
              >
                <label>Agitador (Sec)</label>
                <TextField
                  name="shakerTime"
                  type="number"
                  inputProps={{ min: 0 }}
                  onChange={handleInputChange}
                  value={values[`shakerTime`] || 0}
                />
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="tw-gap-14 tw-mb-4"
            >
              <Box>{generateTanqueCheckboxes()}</Box>

              <Box display="flex" alignItems="center" flexDirection="column">
                <Box>
                  <label>Booster</label>
                  <Switch
                    checked={isBoosterOn}
                    onChange={handleBoosterSwitchToggle}
                    name="switch-booster"
                    sx={{
                      "& .MuiSwitch-switchBase": {
                        "&.Mui-checked": {
                          color: "#fff",
                          "& + .MuiSwitch-track": {
                            opacity: 1,
                            backgroundColor: isBoosterOn ? "green" : "gray",
                          },
                        },
                      },
                    }}
                  />
                </Box>
                <Box>
                  <label>Agitator</label>
                  <Switch
                    checked={isAgitatorOn}
                    onChange={handleAgitatorSwitchToggle}
                    name="switch-agitator"
                    sx={{
                      "& .MuiSwitch-switchBase": {
                        "&.Mui-checked": {
                          color: "#fff",
                          "& + .MuiSwitch-track": {
                            opacity: 1,
                            backgroundColor: isAgitatorOn ? "green" : "gray",
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Box display="flex" width="100%" justifyContent="end">
          <IconButton onClick={handleFertilizationDialogSave}>
            <Save />
          </IconButton>
          <IconButton onClick={handleFertilizationDialogClose}>
            <ExitToApp />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Fertilization;
