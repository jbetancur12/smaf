import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';

interface Field {
  name: string;
  label: string;
  type: string;
}

interface FormProps {
  open: boolean;
  onClose: () => void;
  fields: Field[];
  handleCancel: () => void;
  handleSubmit: (data: Record<string, string>) => void;
  handleEdit: (data: Record<string, string>) => void;
  loading: boolean;
  // Agregar un prop para el elemento a editar (puede ser null si se está creando uno nuevo)
  editItem?: Record<string, string> | null;
}

const Form: React.FC<FormProps> = ({
  open,
  onClose,
  fields,
  handleCancel,
  handleSubmit,
  loading,
  editItem,
  handleEdit
}) => {
   const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Cargar los valores del elemento a editar en el estado cuando editItem cambia
    if (editItem) {
      setValues({ ...editItem });
    }
  }, [editItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = () => {
    if (validateForm()) {
      handleSubmit(values);
    }
    if (!loading) setValues({});
  };

  const onEdit = () => {
    if (validateForm()) {
      handleEdit(values);
    }
    if (!loading) setValues({});
  };

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field: Field) => {
      if (!values[field.name]) {
        validationErrors[field.name] = `El ${field.label} es requerido`;
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  };

  const onCancel = () => {
    setValues({})
    setErrors({});
    handleCancel();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editItem ? 'Editar' : 'Nuevo'}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            required
            margin="normal"
            label={field.label}
            name={field.name}
            type={field.type}
            fullWidth
            value={values[field.name] || ''}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={editItem ? onEdit : onSubmit}>
          {editItem ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Form;
