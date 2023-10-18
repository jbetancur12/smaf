import { TemplateDataResponse, getCustomerTemplates } from '@app/api/template.api';
import Header from '@app/components/Header';
import { readUser } from '@app/services/localStorage.service';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Templates: React.FC = () => {
  const [searchParams] = useSearchParams();
  const customerUser = readUser()?.customer?._id
  const customerAdmin = searchParams.get("customer")
  const customer: string | null | undefined = customerUser || customerAdmin
  const [templates, setTemplates] = useState<TemplateDataResponse[]>([]);


  useEffect(() => {
    // Obtener las plantillas del cliente y actualizar el estado
    if (customer !== null) getCustomerTemplates(customer).then((res) => setTemplates(res));
  }, []);

  // Función para dividir las tarjetas en grupos de 6
  const chunkArray = (arr: any, chunkSize: number) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArr.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArr;
  };

  // Dividir las tarjetas en grupos de 6 por fila
  const cardsInRows = chunkArray(templates, 6);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title='Plantillas' />

      {/* Mapear los grupos de tarjetas */}
      {cardsInRows.map((row, rowIndex) => (
        <Grid container spacing={2} key={rowIndex}>
          {row.map((template: TemplateDataResponse) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={template._id}>
              <Link style={{
                textDecoration: 'none',
                color: 'inherit',
              }} to={{
                pathname: 'charts',
                search: `?customer=${customer}&template=${template._id}`
              }}>
                <Card>
                  <CardContent sx={{textAlign: 'center'}} >
                    <Typography variant="h6" component="div">
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>

                  </CardContent>
                </Card>
              </Link>

            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default Templates;
