// NotificationService.ts

import Notification from '@app/controllers/Notification';
import { AlertColor } from '@mui/material';
import { useSnackbar } from 'notistack';

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = (message: string, severity: AlertColor) => {
    enqueueSnackbar(message, {
      content: (key, message) => (
        <Notification
          message={message}
          onClose={() => closeSnackbar(key)}
          severity={severity}
        />
      ),
    });
  };

  const success = (message: string) => {
    showNotification(message, 'success');
  };

  const error = (message: string) => {
    showNotification(message, 'error');
  };

  const warning = (message: string) => {
    showNotification(message, 'warning');
  };

  const info = (message: string) => {
    showNotification(message, 'info');
  };

  return { success, error, warning, info };
};
