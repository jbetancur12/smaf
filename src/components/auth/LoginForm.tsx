import { useAppDispatch } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { doLogin } from "@app/store/slices/authSlice";
import { Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, PaletteColor, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface LoginFormData {
  email: string
  password: string
}

export const initValues: LoginFormData = {
  email: '',
  password: ''
}

function LoginForm() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { error } = useNotification();

  const [isLoading, setLoading] = useState(false)
  const [values, setValues] = useState<LoginFormData>(initValues);
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

    if (!values.password) {
      validationErrors.password = 'La contraseña es requerida';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };


  const handleChange = (field: keyof LoginFormData, value: string) => {
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
      const response = await dispatch(doLogin(values));

      if (doLogin.fulfilled.match(response)) {
        // Assuming the doLogin action handles successful login and stores user data in Redux
        // You can now navigate to the desired route
        navigate('/');
      } else {
        const errorMessage = response.error?.message || 'An unknown error occurred';
        error(errorMessage);
      }
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
        <Typography component="h1" variant="h5" sx={{ color: "#000"}}>
          Iniciar Sesión
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Recordarme"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, background: theme.palette.primary["500" as keyof PaletteColor],  color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <Grid container >
            <Grid item xs>
              <Link href="#" variant="body2" sx={{color: "black"}}>
                Olvido su contraseña?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginForm
