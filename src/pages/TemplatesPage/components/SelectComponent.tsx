import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, Chip, Grid, Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

export interface Sensor {
  _id: string
  name: string
  sensorType: string
  unit: string
  typePin: string
  customer: string
  template: string
  virtualPin: number
  createdAt: string
  updatedAt: string
}

interface SensorListProps {
  options: Sensor[]
  onSubmit: (selectedOptions: string[]) => void
  setVariablesQuery: (selectedOptions: string | string[]) => void
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const SelectComponent: React.FC<SensorListProps> = ({ options, onSubmit, setVariablesQuery }) => {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [numberOfTagsSelects, setNumberOfTagsSelects] = React.useState(0)

  const ops = options.map((op) => ({
    value: op._id,
    label: op.name
  }));

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    if (value.length <= 5) {
      setVariablesQuery(value)
      setNumberOfTagsSelects(value.length)
      setPersonName(
        typeof value === 'string' ? value.split(',') : value,
      );
    }
  };

  const handleFormSubmit = () => {
    onSubmit(personName)
  }

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={10}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={ops.find(op => op.value === value)?.label || ''}
                      onDelete={() =>
                        setPersonName(
                          personName.filter((item) => item !== value)
                        )
                      }
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                    />
                  ))}
                </Stack>
              )}
              MenuProps={MenuProps}
            >
              {ops.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  <Checkbox checked={personName.indexOf(op.value) > -1} />
                  <ListItemText primary={op.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            type="submit"
            variant="contained"
            onClick={handleFormSubmit}
          >
            Enviar
          </Button>
        </Grid>
      </Grid>
      <span style={{ margin: '10px', fontSize: 12 }}>
        {numberOfTagsSelects} de 5 variables seleccionadas
      </span>
    </Box>
  );
}

export default SelectComponent;