import {
  Box,
  Button,
  Checkbox
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import Fertilization from "./Fertilization";
const TimesComponentProgram = React.lazy(() => import('./TimesComponentProgram'))



interface RowComponentProgramProps {
  rowNumber: number;
  valveName: string;
  minutes: number;
  seconds: number;
  state: number

}



const RowComponentProgram: React.FC<RowComponentProgramProps> = ({ rowNumber, valveName, minutes, seconds, state }) => {


    const [isRowOn, setIsRowOn] = useState(false);
  const [selectedTime, setSelectedTime] = useState<null | Dayjs>(
    dayjs('00:00', 'HH:mm')
  );



  const [isTimesDialogOpen, setTimesDialogOpen] = useState(false)
  const [isFertilizationDialogOpen, setFertilizationDialogOpen] = useState(false)





  const handleRowToggle = () => {
    setIsRowOn(!isRowOn);
  };

  const handleTimeChange = (newTime: Dayjs | null) => {

    setSelectedTime(newTime);
  };




  const handleTimesDialogOpen = () => {
    setTimesDialogOpen(true);
  }

  const handleFertilizationDialogOpen = () => {
    setFertilizationDialogOpen(true);
  }


  const handleTimesDialogClose = () => {
    setTimesDialogOpen(false);
  }

  const handleFertilizationDialogClose = () => {
    setFertilizationDialogOpen(false);
  }



  useEffect(() => {
    setSelectedTime(dayjs(`${minutes}:${seconds}`, 'HH:mm'));
    setIsRowOn("" + state == "1")
  }, [minutes, seconds, state]);


  return (
    <>
      <Box display="flex" alignItems="center" className="tw-mb-2 tw-gap-3">
        <span>{rowNumber}</span>
        <Checkbox checked={isRowOn} onChange={handleRowToggle} />
        <TimeField
          format="HH:mm"
          value={selectedTime}
          onChange={handleTimeChange}
        />
        <Button variant="contained" color="primary" onClick={handleTimesDialogOpen}>
          Tiempos
        </Button>
        <Button variant="contained" color="primary" onClick={handleFertilizationDialogOpen}>
          Fertilizar
        </Button>
        {/* <Box display="flex" alignItems="center" className="">
          <label>{valveName}</label>
          <Switch
            checked={isVMasterOn}
            onChange={handleVMasterToggle}
            name="switch"
          />
        </Box> */}

      </Box>
      {isTimesDialogOpen && <TimesComponentProgram isTimesDialogOpen={isTimesDialogOpen} handleTimesDialogClose={handleTimesDialogClose} rowNumber={rowNumber}/>}
      {isFertilizationDialogOpen && <Fertilization isFertilizationDialogOpen={isFertilizationDialogOpen} handleFertilizationDialogClose={handleFertilizationDialogClose} rowNumber={rowNumber}/>}
      {/* <TimesComponentProgram rowNumber={rowNumber} isTimesDialogOpen={isTimesDialogOpen} handleTimesDialogClose={handleTimesDialogClose} /> */}
    </>
  );
}

export default RowComponentProgram;
