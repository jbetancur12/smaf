
import { ExitToApp, Save } from '@mui/icons-material';
import { Box, Grid, IconButton, Switch, useTheme } from '@mui/material';
import { useState } from 'react';
import Days from './Days';
import RowComponent from './RowComponentProgram';

interface Props {
  handleProgramDialogClose: () => void
}

const Program: React.FC<Props> = ({ handleProgramDialogClose }) => {


  const [values, setValues] = useState<Record<string, string>>({});
  const [colorValues, setColorValues] = useState<Record<string, string>>({});

  const theme = useTheme()
  const numberOfRows = 8;
  const valveNames = ["V_master_1", "V_master_2", "V_master_3", "V_master_4", "Bomba 1", "Bomba 2", "Lluvia"]



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
      <Days />
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