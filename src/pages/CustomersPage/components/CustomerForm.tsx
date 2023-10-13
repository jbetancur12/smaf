import { Box, Button, Grid, TextField } from '@mui/material';
import React from 'react';

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  formData: CustomerFormData;
  setFormData: (data: CustomerFormData) => void;
  setEditingCustomer: (data: any) => void;
  isEditing: boolean;
  editingCustomer: CustomerFormData | null
}

export interface CustomerFormData {
  _id: string
  IdCustomer: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address1: string;
  createdAt: Date
  users: []
}

const CustomerForm: React.FC<CustomerFormProps> = ({ formData, onSubmit, onCancel, setFormData, isEditing, editingCustomer, setEditingCustomer }) => {

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing) {
      // Si está en modo de edición, actualiza los datos directamente en editingCustomer
      setEditingCustomer({
        ...editingCustomer,
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

  const handleCancel = () => {
    onCancel()

  };

  return (
    <Box className="tw-max-w-lg">
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="name"
              label="Nombre"
              value={isEditing ? editingCustomer?.name || '' : formData.name}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="email"
              name="email"
              label="Email"
              value={isEditing ? editingCustomer?.email || '' : formData.email}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="IdCustomer"
              label="ID"
              value={isEditing ? editingCustomer?.IdCustomer || '' : formData.IdCustomer}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="phone"
              label="Teléfono"
              value={isEditing ? editingCustomer?.phone || '' : formData.phone}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="country"
              label="País"
              value={isEditing ? editingCustomer?.country || '' : formData.country}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="city"
              label="Ciudad"
              value={isEditing ? editingCustomer?.city || '' : formData.city}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="address1"
              label="Dirección"
              value={isEditing ? editingCustomer?.address1 || '' : formData.address1}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box className="tw-mt-5">
          <Button type="submit" variant="contained" color="primary" className='tw-mr-2'>
            {isEditing ? 'Guardar Cambios' : 'Crear Nueva Compañia'}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CustomerForm;
