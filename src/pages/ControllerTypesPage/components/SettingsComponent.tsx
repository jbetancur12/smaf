import { ExitToApp, Save } from "@mui/icons-material";
import { Box, IconButton, Switch, TextField, useTheme } from "@mui/material";
import { useState } from "react";

interface SettingsComponentProps {
  isSettingsDialogOpen: boolean;
  handleSettingsDialogClose: () => void;
}

const valveNames = ["V_master_1", "V_master_2", "V_master_3", "V_master_4", "Bomba 1", "Bomba 2", "Lluvia"];

const SettingsComponent: React.FC<SettingsComponentProps> = ({ isSettingsDialogOpen, handleSettingsDialogClose }) => {
  const theme = useTheme();

  const styles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9998,
  };

  const [numberOfOutputs, setNumberOfOutputs] = useState(0);
  const [numberOfTanks, setNumberOfTanks] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSettingsDialogSave = () => {
    // Implement your save logic here
  };

  const handleNumberOfOutputsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumberOfOutputs = parseInt(event.target.value, 10);
    setNumberOfOutputs(newNumberOfOutputs);
  };

  const handleNumberOfTanksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumberOfTanks = parseInt(event.target.value, 10);
    setNumberOfTanks(newNumberOfTanks);
  };

  const handleSwitchToggle = (valveName: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [valveName]: prevValues[valveName] === '1' ? '0' : '1',
    }));
  };

  const generateValvesSwitches = () => {
    return valveNames.map((valveName, idx) => (
      <Box display="flex" justifyContent="space-between" alignItems="center" className="tw-gap-4" key={idx}>
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
      </Box>
    ));
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
        boxShadow: theme.shadows[5],
        display: isSettingsDialogOpen ? 'flex' : 'none',
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Box>
          <section>
            <Box display="flex" alignItems="center" justifyContent="space-between" className="tw-mb-2 tw-gap-3">
              <label>Numero de Salidas</label>
              <TextField
                type="number"
                value={numberOfOutputs}
                onChange={handleNumberOfOutputsChange}
              />
            </Box>
          </section>
          <section>
            <Box display="flex" alignItems="center" justifyContent="space-between" className="tw-mb-2 tw-gap-3">
              <label>Numero de Tanques</label>
              <TextField
                type="number"
                value={numberOfTanks}
                onChange={handleNumberOfTanksChange}
              />
            </Box>
          </section>
        </Box>
        <Box display="flex" alignItems="center" className="tw-gap-10">
          <Box display="flex" flexDirection="column">
            {generateValvesSwitches()}
          </Box>
          <Box>
            {
              ["Booster", "Agitador"].map((valveName, idx) => (
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
              ))
            }
          </Box>
        </Box>
        <section>
          <Box display="flex" width="100%" justifyContent="end">
            <IconButton onClick={handleSettingsDialogSave}>
              <Save />
            </IconButton>
            <IconButton onClick={handleSettingsDialogClose}>
              <ExitToApp />
            </IconButton>
          </Box>
        </section>
      </Box>
    </Box>
  );
};

export default SettingsComponent;
