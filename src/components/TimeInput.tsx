
import { TimeField } from '@mui/x-date-pickers';
import React from 'react';

const TimeInput = () => {
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(null);

  const handleTimeChange = (newTime: Date | null) => {
    setSelectedTime(newTime);
  };

  return (
    <TimeField
      format="HH:mm"
      value={selectedTime}
      onChange={handleTimeChange}
    />
  );
};

export default TimeInput;
