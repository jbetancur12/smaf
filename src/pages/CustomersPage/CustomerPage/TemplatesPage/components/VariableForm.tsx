import {
  Box,
  Button,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import React, { useState } from 'react';

interface VariableFormProps {
  onSubmit: (data: VariableFormData) => void;
  onEdit: (data: VariableFormData) => void;
  onCancel: () => void;
  formData: VariableFormData;
  setFormData: (data: any) => void;
  setEditingVariable: (data: any) => void;
  isEditing: boolean;
  editingVariable?: VariableFormData;
}

export interface VariableFormData {
  name: string;
  sensorType: string; // Add sensorType field
  unit: string; // Add unit field
  virtualPin: string; // Add virtualPin field
  typePin: string; // Add typePin field
  type: string;
}

const VariableForm: React.FC<VariableFormProps> = ({
  formData,
  onSubmit,
  onCancel,
  setFormData,
  isEditing,
  editingVariable,
  setEditingVariable,
  onEdit
}) => {

  const [errors, setErrors] = useState<Record<string, string>>({});


  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {};
    let isValid = true;
    console.log(isEditing)

      if ((!isEditing && !formData.name) || (isEditing && !editingVariable?.name)) {
        validationErrors.name = `El nombre es requerido`;
        isValid = false;
      }

      if ((!isEditing && !formData.sensorType)  || (isEditing &&  !editingVariable?.sensorType)) {
        validationErrors.sensorType = `El Tipo de Sensor es requerido`;
        isValid = false;
      }

      if ((!isEditing && !formData.unit)  || (isEditing &&  !editingVariable?.unit)) {
        validationErrors.unit = `La Unidad  es requerida`;
        isValid = false;
      }

      if ((!isEditing && !formData.virtualPin)  || (isEditing &&  !editingVariable?.virtualPin)) {
        validationErrors.virtualPin = `El Pin Virtual  es requerido`;
        isValid = false;
      }

      if ((!isEditing && !formData.typePin)  || (isEditing &&  !editingVariable?.typePin)) {
        validationErrors.typePin = `El tipo de pin es requerido`;
        isValid = false;
      }



    setErrors(validationErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {

      onSubmit(formData);
    }
  };

  const handleFormEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if(editingVariable) onEdit(editingVariable);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing) {
      // Si está en modo de edición, actualiza los datos directamente en editingCustomer
      setEditingVariable({
        ...editingVariable,
        [name]: value,
      });
    } else {
      // Si no está en modo de edición, actualiza los datos en formData
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }



  const handleCancel = () => {
    setFormData({
      name: "",
      sensorType: '',
      unit: '',
      virtualPin: '',
      typePin: '',
    })
    setEditingVariable({
      name: "",
      sensorType: '',
      unit: '',
      virtualPin: '',
      typePin: '',
    })
    onCancel();
  };



  return (
    <Box className="tw-max-w-lg">
      <form onSubmit={!isEditing ? handleFormSubmit : handleFormEdit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="name"
              label="Nombre"
              value={isEditing ? editingVariable?.name || '' : formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="sensorType"
              label="Tipo de Sensor"
              value={isEditing ? editingVariable?.sensorType || '' : formData.sensorType}
              onChange={handleInputChange}
              error={!!errors.sensorType}
              helperText={errors.sensorType}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="unit"
              label="Ingrese la Unidad"
              value={isEditing ? editingVariable?.unit || '' : formData.unit}
              onChange={handleInputChange}
              error={!!errors.unit}
              helperText={errors.unit}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="virtualPin"
              label="Pin Virtual"
              value={isEditing ? editingVariable?.virtualPin || '' : formData.virtualPin}
              onChange={handleInputChange}
              error={!!errors.virtualPin}
              helperText={errors.virtualPin}
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              type="text"
              name="typePin"
              label="Tipo de Pin"
              value={isEditing ? editingVariable?.typePin || '' : formData.typePin}
              onChange={handleInputChange}
              error={!!errors.typePin}
              helperText={errors.typePin}
              fullWidth
            />
          </Grid> */}
          <Grid item xs={12}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="typePin"
              displayEmpty
              label="Tipo Pin"
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Seleccione un tipo</em>;
                }

                return selected;
              }}
              value={isEditing ? editingVariable?.typePin || 'analogInput' : formData.typePin}
              onChange={handleSelectChange}
              error={!!errors.typePin}
              fullWidth
            >
              <MenuItem disabled value="">
                <em>Seleccione un tipo</em>
              </MenuItem>
              <MenuItem value="analogInput">Entrada Analoga</MenuItem>
              <MenuItem value="digitalOuput">Salida Digital</MenuItem>
            </Select>
            <FormHelperText sx={{color:"red", marginLeft: 2}}>{errors.type}</FormHelperText>
            {/* <TextField
              id="outlined-select-currency"
              name='type'
              select
              label="Tipo de Pin"
              defaultValue="digitalOuput"
              onChange={handleInputChange}
              fullWidth


            >

              <MenuItem value="analogInput">
                Entrada Analoga
              </MenuItem>
              <MenuItem value="digitalOuput">
                Salida Digital
              </MenuItem>

            </TextField> */}
          </Grid>
        </Grid>
        <Box className="tw-mt-5">
          <Button type="submit" variant="contained" color="primary" className="tw-mr-2">
            {isEditing ? 'Guardar Cambios' : 'Crear Nueva Variables'}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default VariableForm;