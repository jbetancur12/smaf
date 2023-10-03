// Notification.tsx

import { CheckCircleOutline, Error, Info, Warning } from '@mui/icons-material';
import { AlertColor, Snackbar, SnackbarContent } from '@mui/material';
import { SnackbarKey, SnackbarMessage } from 'notistack';
import React from 'react';

interface NotificationProps {
  message: SnackbarMessage;
  onClose: () => void;
  severity: AlertColor;
}

// Función para determinar el color de fondo según la severidad
const getBackgroundColor = (severity: 'success' | 'error' | 'warning' | 'info') => {
  switch (severity) {
    case 'success':
      return 'tw-bg-green-500'; // Color de fondo para éxito
    case 'error':
      return 'tw-bg-red-700'; // Color de fondo para error
    case 'warning':
      return 'tw-bg-yellow-500'; // Color de fondo para advertencia
    case 'info':
      return 'tw-bg-blue-500'; // Color de fondo para información
    default:
      return 'inherit';
  }
};

const getIcon = (severity: 'success' | 'error' | 'warning' | 'info') => {
  switch (severity) {
    case 'success':
      return <CheckCircleOutline />;
    case 'error':
      return <Error />;
    case 'warning':
      return <Warning />;
    case 'info':
      return <Info />;
    default:
      return null;
  }
};

const Notification = React.forwardRef<SnackbarKey, NotificationProps>(
  ({ message, onClose, severity }, ref) => {
    return (
      <Snackbar
        ref={ref}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={true}
        autoHideDuration={30000}
        onClose={onClose}
      >
        <SnackbarContent
          message={
            <div className="tw-flex tw-items-center"> {/* Utiliza flexbox para alinear el icono y el mensaje */}
              <div className={`tw-mr-2 tw-text-${getBackgroundColor(severity)}`}> {/* Estilo del icono */}
                {getIcon(severity)} {/* Icono según la severidad */}
              </div>
              <span>
                {message}
              </span>
            </div>
          }
          className={getBackgroundColor(severity)}
        />

      </Snackbar>
    );
  }
);

export default Notification;
