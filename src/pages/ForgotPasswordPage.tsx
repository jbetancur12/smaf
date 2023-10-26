import { useAppDispatch } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { doResetPassword } from "@app/store/slices/authSlice";
import { Box, Button, Container, PaletteColor, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface ForgotPasswordFormData {
  email: string
}

export const initValues: ForgotPasswordFormData = {
  email: '',
}

function ForgotPasswordPage() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { error, success } = useNotification();

  const [isLoading, setLoading] = useState(false)
  const [values, setValues] = useState<ForgotPasswordFormData>(initValues);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});


  const validateForm = (): boolean => {
    const validationErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!values.email) {
      validationErrors.email = 'El email es requerido';
      isValid = false;
    }


    setErrors(validationErrors);
    return isValid;
  };


  const handleChange = (field: keyof ForgotPasswordFormData, value: string) => {
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
        await dispatch(doResetPassword(values));


        // Assuming the doLogin action handles successful login and stores user data in Redux
        // You can now navigate to the desired route
        success("Al correo electronico fueron enviadas las Instrucciones")
        navigate('/');

        const errorMessage = 'An unknown error occurred';
        error(errorMessage);

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
        <Typography component="h1" variant="h2" sx={{ color: "#000", marginBottom:3}}>
          Restablecer Contraseña
        </Typography>
        <Typography component="p">
        Introduce tu dirección de correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ color: theme.palette.primary["100" as keyof PaletteColor] }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, background: theme.palette.primary["500" as keyof PaletteColor],  color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando Instrucciones...' : 'Enviar Instrucciones'}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default ForgotPasswordPage
