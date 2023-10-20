import { httpApi } from '@app/api/http.api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';

interface SubscriptionProps {
  customerId?: string;
  hasTrial?: boolean
  hasSubscription?: boolean
}

const Subscription: React.FC<SubscriptionProps> = ({
  customerId,
  hasSubscription,
  hasTrial
}) => {
  const [isSubscriptionActive, setSubscriptionActive] = useState<boolean | undefined>(false);
  const [isTrialActive, setTrialActive] = useState<boolean | undefined>(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTimeUnit, setSelectedTimeUnit] = useState('days');
  const [timeValue, setTimeValue] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [trial, setTrial] = useState(false)
  const [subscription, setSubcription] = useState(false)



  useEffect(() => {
    setSubscriptionActive(hasSubscription)
    setTrialActive(hasTrial)
  }, [])

  const initialEndDate = new Date(startDate);
  initialEndDate.setDate(startDate.getDate() + 1);
  const [endDate, setEndDate] = useState(initialEndDate);


  const onActivateSubscription = () => {
    httpApi
      .post<any>('api/activate-subscription/' + customerId, { startDate, endDate })
      .then((res) => {
        if (res.statusText === "OK") setSubscriptionActive(res.data.activeSubscription.isActive)
      })
  };

  const onActivateTrial = () => {
    httpApi
      .post<any>('api/activate-trial/' + customerId, { startDate, endDate })
      .then((res) => {
        console.log(res)
        if (res.statusText === "OK") { setTrialActive(res.data.trialPeriod.isOnTrial) }
      })
  };

  const handleActivateSubscription = () => {
    setSubcription(true)
    setOpenModal(true);
  };

  const handleActivateTrial = () => {
    setTrial(true)
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setStartDate(new Date())
    setEndDate(initialEndDate)
    setTimeValue(1)
    setSelectedTimeUnit("days")
    setOpenModal(false);
  };

  const handleTimeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(e.target.value, 10);
    if (!isNaN(numericValue)) {
      setTimeValue(numericValue);
      updateEndDate(startDate, numericValue, selectedTimeUnit);
    }
  };

  const handleTimeUnitChange = (e: SelectChangeEvent) => {
    setSelectedTimeUnit(e.target.value as string);
    updateEndDate(startDate, timeValue, e.target.value as string);
  };

  const updateEndDate = (start: Date, value: number, unit: string) => {
    const calculatedEndDate = calculateEndDate(start, value, unit);
    setEndDate(calculatedEndDate);
  };

  const handleConfirm = () => {
    // Aquí puedes realizar la solicitud al servidor para activar la suscripción o el período de prueba
    // Utiliza startDate, endDate y otros datos para determinar la duración
    if (subscription) {
      onActivateSubscription()
    }
    if (trial) {
      onActivateTrial()
    }
    setStartDate(new Date())
    setEndDate(initialEndDate)
    setTimeValue(1)
    setSelectedTimeUnit("days")
    setOpenModal(false);
  };

  const calculateEndDate = (start: Date, value: number, unit: string) => {
    const startDateObject = new Date(start);

    switch (unit) {
      case 'days':
        startDateObject.setDate(startDateObject.getDate() + value);
        break;
      case 'months':
        startDateObject.setMonth(startDateObject.getMonth() + value);
        break;
      case 'years':
        startDateObject.setFullYear(startDateObject.getFullYear() + value);
        break;
      default:
        break;
    }

    return startDateObject;
  };

  return (
    <div>
      <h2>Administrar Estado de Suscripción</h2>
      <Button
        variant={isSubscriptionActive ? 'outlined' : 'contained'}
        color="primary"
        onClick={handleActivateSubscription}
        disabled={isSubscriptionActive}
        className='tw-mr-4'
      >
        {isSubscriptionActive ? 'Suscripción Activa' : 'Activar Suscripción'}
      </Button>
      <Button
        variant={isTrialActive ? 'outlined' : 'contained'}
        color="primary"
        onClick={handleActivateTrial}
        disabled={isTrialActive || isSubscriptionActive}
      >
        {isTrialActive ? 'Período de Prueba Activo' : 'Activar Período de Prueba'}
      </Button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 600 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Fecha de inicio"
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                sx={{ marginBottom: 2 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha de finalización"
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                // disabled
                sx={{ marginBottom: 2 }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Duración"
                type="number"
                value={timeValue}
                onChange={handleTimeValueChange}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6} className='tw-mb-4'>
              <Select
                value={selectedTimeUnit}
                onChange={handleTimeUnitChange}
                sx={{ width: '100%' }}
              >
                <MenuItem value="days">Días</MenuItem>
                <MenuItem value="months">Meses</MenuItem>
                <MenuItem value="years">Años</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleConfirm}>Confirmar</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Subscription;
