import { VariableData } from "@app/api/variable.api";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

interface SensorProps {
  variables: VariableData[];
  data: any;
}
const Sensors: React.FC<SensorProps> = ({ variables, data }) => {
  // Función para dividir las tarjetas en grupos de 6
  const chunkArray = (arr: any, chunkSize: number) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArr.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArr;
  };

  // Dividir las tarjetas en grupos de 6 por fila
  const cardsInRows = chunkArray(variables, 6);

  return (
    <Box m="1.5rem 2.5rem">
      {cardsInRows.map((row, rowIndex) => (
        <Grid className="tw-mt-0" container spacing={4} key={rowIndex}>
          {row.map((variable: VariableData) => {
            if (variable.typePin === "analogInput") {
              const value =
                (data[variable.virtualPin]
                  ? data[variable.virtualPin].value
                  : 0) +
                " " +
                variable.unit;
              const date = data[variable.virtualPin]
                ? data[variable.virtualPin].date
                : 0;
              return (
                <Grid
                  className="tw-mt-0"
                  item
                  xs={12}
                  md={4}
                  lg={2}
                  key={variable.virtualPin}
                >
                  <Card style={{ marginBottom: "1rem" }}>
                    <CardContent
                      sx={{ textAlign: "center", position: "relative" }}
                    >
                      <Typography variant="h6" component="div">
                        {variable.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        {value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {date}
                      </Typography>
                      {/* Aquí puedes agregar más contenido de la tarjeta si es necesario */}
                      <Tooltip
                        title={
                          <div>
                            <p>
                              <strong>Virtual Pin:</strong>{" "}
                              {variable.virtualPin ? variable.virtualPin : "NA"}
                            </p>
                            <p>
                              <strong>Tipo Sensor:</strong>{" "}
                              {variable.sensorType ? variable.sensorType : "NA"}
                            </p>
                          </div>
                        }
                        arrow
                      >
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                          }}
                          size="small"
                          color="secondary"
                          onClick={() => {
                            // Puedes agregar aquí la lógica para mostrar más información al hacer clic en el botón.
                          }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </CardContent>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      ))}
    </Box>
  );
};

export default Sensors;
