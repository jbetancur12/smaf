import { useAppSelector } from "@app/hooks/reduxHooks";
import { ExitToApp, Save } from "@mui/icons-material";
import { Box, Grid, IconButton, Switch, useTheme } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface FertilizationProgramProps {
  rowNumber: number;
  isFertilizationDialogOpen: boolean; // Propiedad pasada al componente
  handleFertilizationDialogClose: () => void;
}

const Fertilization: React.FC<FertilizationProgramProps> = ({ rowNumber, isFertilizationDialogOpen, handleFertilizationDialogClose }) => {

  const theme = useTheme()
  const programParameters = useAppSelector((state) => state.parameters)

  const styles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta la opacidad aquí (0.5 es 50% de opacidad)
    zIndex: 9998, // Coloca el fondo detrás del modal
  };

  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    lunes: !!programParameters?.diasSemana[1], // Convierte el número a booleano
    martes: !!programParameters?.diasSemana[2], // Convierte el número a booleano
    miércoles: !!programParameters?.diasSemana[3], // Convierte el número a booleano
    jueves: !!programParameters?.diasSemana[4], // Convierte el número a booleano
    viernes: !!programParameters?.diasSemana[5], // Convierte el número a booleano
    sábado: !!programParameters?.diasSemana[6], // Convierte el número a booleano
    domingo: !!programParameters?.diasSemana[0], // Convierte el número a booleano
  });
  const [isSwitchOn, setIsSwitchOn] = useState(programParameters?.operation);
  const [fillingAndPressureTime, setFillingAndPressureTime] = useState<null | Dayjs>(
    dayjs('00:00', 'HH:mm')
  );
  const [advanceTime, setAdvanceTime] = useState<null | Dayjs>(
    dayjs('00:00', 'HH:mm')
  );

  const [shakerTime, setShakerTime] = useState<null | Dayjs>(
    dayjs('00:00', 'HH:mm')
  );

  const [tanqueCheckboxes, setTanqueCheckboxes] = useState<Record<string, boolean>>({});

  const [isBoosterOn, setIsBoosterOn] = useState(false);
  const [isAgitatorOn, setIsAgitatorOn] = useState(false);


  const handleBoosterSwitchToggle = () => {
    setIsBoosterOn(!isBoosterOn);
  };

  // Handler for the "Agitator" switch
  const handleAgitatorSwitchToggle = () => {
    setIsAgitatorOn(!isAgitatorOn);
  };

  const handleFertilizationDialogSave = () => { }

  const handleDayToggle = (day: string) => {
    setSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [day]: !prevSelectedDays[day],
    }));
  };

  const handleSwitchToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const handleFillingAndPressureTimeChange = (newTime: Dayjs | null) => {
    setFillingAndPressureTime(newTime);
  };

  const handleAdvanceTimeChange = (newTime: Dayjs | null) => {
    setAdvanceTime(newTime);
  };


  const handleShakerTimeChange = (newTime: Dayjs | null) => {
    setShakerTime(newTime);
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
        display: isFertilizationDialogOpen ? 'flex' : 'none',
        flexDirection: "column",
        alignItems: "center",
        // width:"100%"
      }} >
        <Grid container>

          <Box id="2">
            <Box display="flex" alignItems="center" justifyContent="space-between" id="1" className="tw-mb-4">
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
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          opacity: 1,
                          backgroundColor: isSwitchOn ? 'green' : 'gray',
                        },
                      },
                    },
                  }}
                />


              </Box>
            </Box>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" className="tw-mb-2 tw-gap-3">
                <label>Llenado y la presurizacion (Sec)</label>
                <TimeField
                  format="HH:mm"
                  value={fillingAndPressureTime}
                  onChange={handleFillingAndPressureTimeChange}
                />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" className="tw-mb-2 tw-gap-3">
                <label>Tiempo de Avance (Sec)</label>
                <TimeField
                  format="HH:mm"
                  value={advanceTime}
                  onChange={handleAdvanceTimeChange}
                />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" className="tw-mb-2 tw-gap-3">
                <label>Agitador (Sec)</label>
                <TimeField
                  format="HH:mm"
                  value={shakerTime}
                  onChange={handleShakerTimeChange}
                />
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="tw-gap-14 tw-mb-4"
            >
              <Box>
                {generateTanqueCheckboxes()}
              </Box>


              <Box display="flex" alignItems="center" flexDirection="column">
                <Box>
                  <label>Booster</label>
                  <Switch
                    checked={isBoosterOn}
                    onChange={handleBoosterSwitchToggle}
                    name="switch-booster"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          color: '#fff',
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            backgroundColor: isBoosterOn ? 'green' : 'gray',
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
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          color: '#fff',
                          '& + .MuiSwitch-track': {
                            opacity: 1,
                            backgroundColor: isAgitatorOn ? 'green' : 'gray',
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
  )
}

export default Fertilization
