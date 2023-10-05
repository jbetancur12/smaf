import { VariableData } from "@app/api/variable.api";
import { Box, Grid } from "@mui/material";
import ActuatorsCard from './ActuatorsCard';

interface Actuatorsprops {
  outputs: VariableData[];
  states: any;
  handleOutput: (vp?: number, msg?: string, customer?: string) => void
}

const Actuators: React.FC<Actuatorsprops> = ({ outputs, states, handleOutput }) => {



  const chunkArray = (arr: any, chunkSize: number) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArr.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArr;
  };


  // Dividir las tarjetas en grupos de 6 por fila
  const cardsInRows = chunkArray(outputs, 6);


  return (
    <Box m="1.5rem 2.5rem">
      {cardsInRows.map((row, rowIndex) => (
        <Grid container spacing={4} key={rowIndex}>
          {row.map((output: VariableData) => (
            <ActuatorsCard name={output.name} key={output.name} virtualPin={output.virtualPin} states={states} handleOutput={handleOutput}/>
          ))}
        </Grid>
      ))}
    </Box>
  )
}

export default Actuators
