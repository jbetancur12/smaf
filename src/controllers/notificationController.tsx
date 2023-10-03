import { IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';



type NotificationProps = {
  message: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
};



const variantClasses = {
  success: 'tw-bg-green-500',
  info: 'tw-bg-blue-500',
  warning: 'tw-bg-yellow-500',
  error: 'tw-bg-red-700',
};

const openNotification = (config: NotificationProps) => {
  const { enqueueSnackbar } = useSnackbar();



  enqueueSnackbar(config.message, {
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    autoHideDuration: 5000,
    action: (
      <IconButton size="small" color="inherit" onClick={() => { }}>
        Close
      </IconButton>
    ),
    className: `tw-bg-gray-800 ${variantClasses[config.type]}`,

  });
};

export const notificationController = {
  success: (config: NotificationProps) =>
    openNotification({ ...config, type: 'success' }),
  info: (config: NotificationProps) =>
    openNotification({ ...config, type: 'info' }),
  warning: (config: NotificationProps) =>
    openNotification({ ...config, type: 'warning' }),
  error: (config: NotificationProps) =>
    openNotification({ ...config, type: 'error' }),
};
