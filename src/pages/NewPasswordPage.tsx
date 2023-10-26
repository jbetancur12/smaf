import { useAppDispatch } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { doSetNewPassword } from "@app/store/slices/authSlice";
import { Box, Button, Container, PaletteColor, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


interface NewPasswordFormData {
  password: string
  confirmPassword: string
}

export const initValues: NewPasswordFormData = {
  password: '',
  confirmPassword: ''
}

function NewPasswordPage() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const [searchParams, _setSearchParams] = useSearchParams()

  const { error, success } = useNotification();

  const [isLoading, setLoading] = useState(false)
  const [values, setValues] = useState<NewPasswordFormData>(initValues);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const code = searchParams.get('code')

  const validateForm = (): boolean => {
    const validationErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!values.password) {
      validationErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    if (!values.confirmPassword) {
      validationErrors.confirmPassword = 'La confirmacion de contraseña es requerida';
      isValid = false;
    }

    if (values.password !== values.confirmPassword) {
      validationErrors.email = 'Las contraseñas no coinciden';
      isValid = false;
      error("Las contraseñas no coinciden")
    }


    setErrors(validationErrors);
    return isValid;
  };


  const handleChange = (field: keyof NewPasswordFormData, value: string) => {
    setValues({ ...values, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Dispatch the doLogin action
      await dispatch(doSetNewPassword({ newPassword: values.password, code: code }))
        .unwrap()
        .then(() => {
          success("Contraseña cambiada")
          navigate('/auth/login')
        })

    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        error(err.message); // Extraer el mensaje de error si es una instancia de Error
      } else {
        error('An unknown error occurred'); // O proporcionar un mensaje predeterminado si el tipo de error es desconocido
      }

      // Handle login error and show a notification
      // notificationController.error({ message: 'Login failed' , type: "error" });
    } finally {
      setLoading(false);
    }
  }


  return (
    <Container component="main" maxWidth="xs" >
      <Box
        className="tw-shadow tw-p-6"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h2" sx={{ color: "#000", marginBottom: 3 }}>
          Nueva Contraseña
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Contraseña"
            name="password"
            autoComplete="password"
            autoFocus
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ color: theme.palette.primary["100" as keyof PaletteColor] }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirmar contraseña"
            name="confirmPassword"
            autoComplete="confirmPassword"
            autoFocus
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ color: theme.palette.primary["100" as keyof PaletteColor] }}
          />


          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, background: theme.palette.primary["500" as keyof PaletteColor], color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? 'Creando Contraseña...' : 'Crear Contraseña'}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default NewPasswordPage
