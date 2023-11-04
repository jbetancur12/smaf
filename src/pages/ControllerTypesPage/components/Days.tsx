import { useAppSelector } from "@app/hooks/reduxHooks";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import { useState } from "react";

const Days = () => {
  const programParameters = useAppSelector((state) => state.parameters)

  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    lunes: !!programParameters?.diasSemana[1], // Convierte el número a booleano
    martes: !!programParameters?.diasSemana[2], // Convierte el número a booleano
    miércoles: !!programParameters?.diasSemana[3], // Convierte el número a booleano
    jueves: !!programParameters?.diasSemana[4], // Convierte el número a booleano
    viernes: !!programParameters?.diasSemana[5], // Convierte el número a booleano
    sábado: !!programParameters?.diasSemana[6], // Convierte el número a booleano
    domingo: !!programParameters?.diasSemana[0], // Convierte el número a booleano
  });

  const [selectedProgram, setSelectedProgram] = useState<string>("A");
  const [isSwitchOn, setIsSwitchOn] = useState( programParameters?.operation);


  const handleDayToggle = (day: string) => {
    setSelectedDays((prevSelectedDays) => ({
      ...prevSelectedDays,
      [day]: !prevSelectedDays[day],
    }));
  };

  const handleProgramChange = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value as string);
  };

  const handleSwitchToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="center" className="tw-gap-10 tw-mb-4">
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
          <FormControl>
            <InputLabel id="program-select-label">Programa</InputLabel>
            <Select
              labelId="program-select-label"
              id="program-select"
              value={selectedProgram}
              onChange={handleProgramChange}
            >
              <MenuItem value="A">Programa A</MenuItem>
              <MenuItem value="B">Programa B</MenuItem>
              <MenuItem value="C">Programa C</MenuItem>
              <MenuItem value="D">Programa D</MenuItem>
              <MenuItem value="E">Programa E</MenuItem>
              <MenuItem value="F">Programa F</MenuItem>
              <MenuItem value="G">Programa G</MenuItem>
              <MenuItem value="H">Programa H</MenuItem>
              {/* Agrega opciones para los programas C a H */}
            </Select>
          </FormControl>
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
    </div>
  );
}

export default Days;
