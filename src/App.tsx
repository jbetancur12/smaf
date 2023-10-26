import { CssBaseline, StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import { themeSettings } from 'theme';
import { useAppSelector } from "./hooks/reduxHooks";
import AppRouter from "./router/AppRouter";


function App() {
  const mode = useAppSelector((state) => state.mode.mode)
  console.log("🚀 ~ file: App.tsx:10 ~ App ~ mode:", mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <AppRouter />
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default App
