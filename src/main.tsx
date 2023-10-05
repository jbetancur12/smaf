import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './store/store';


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

// const theme = createTheme({
//   components: {
//     MuiPopover: {
//       defaultProps: {
//         container: rootElement,
//       },
//     },
//     MuiPopper: {
//       defaultProps: {
//         container: rootElement,
//       },
//     },
//     MuiDialog: {
//       defaultProps: {
//         container: rootElement,
//       },
//     },
//     MuiModal: {
//       defaultProps: {
//         container: rootElement,
//       },
//     },
//   },
// });


root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
    <SnackbarProvider maxSnack={3} anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}>

      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </Provider>

    </SnackbarProvider>
    {/* </ThemeProvider> */}
  </React.StrictMode>,
)
