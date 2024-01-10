import { useAppSelector } from "@app/hooks/reduxHooks";
import { setParametersController } from "@app/store/slices/parametersControllerSlice";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface DaysProps {
  data: number[];
  handleChange: (program: string) => void;
}

function objectToBinary(obj: Record<string, boolean>): number {
  const days = [
    "domingo",
    "sábado",
    "viernes",
    "jueves",
    "miércoles",
    "martes",
    "lunes",
  ];
  let binaryString = "";
  for (const day of days) {
    binaryString += obj[day] ? "0" : "1";
  }
  return parseInt(binaryString, 2);
}

const Days: React.FC<DaysProps> = ({ data, handleChange }) => {
  const { frame1, program } = useAppSelector(
    (state) => state.parametersController
  );
  const cloneFrame = [...frame1];
  console.log("🚀 ~ cloneFrame:", cloneFrame);
  const dispatch = useDispatch();

  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    lunes: false,
    martes: false,
    miércoles: false,
    jueves: false,
    viernes: false,
    sábado: false,
    domingo: false,
  });

  const binaryValue = objectToBinary(selectedDays);
  console.log("🚀 ~ binaryValue:", binaryValue);

  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    setIsSwitchOn(data[0] === 1);
    setSelectedProgram(program);

    if (data.length > 0) {
      const binaryString = data[1].toString(2).padStart(7, "0");
      const days = Object.keys(selectedDays);
      days.forEach((day, index) => {
        setSelectedDays((prevSelectedDays) => ({
          ...prevSelectedDays,
          [day]: binaryString[index] === "1",
        }));
      });
    }
  }, [data]);

  const handleDayToggle = (day: string) => {
    const clone = { ...selectedDays, [day]: !selectedDays[day] };
    setSelectedDays(clone);
  };

  const handleProgramChange = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value as string);
    dispatch(
      setParametersController({ program: event.target.value as string })
    );
    handleChange(event.target.value as string);
  };

  const handleSwitchToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  // const valuesToSend = `${isSwitchOn?1:0},${binaryValue}`

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        className="tw-gap-10 tw-mb-4"
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
    </div>
  );
};

export default Days;
