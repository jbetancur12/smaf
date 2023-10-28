import Header from "@app/components/Header";
import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { retrieveControllers } from "@app/store/slices/controllerSlice";
import { Box, PaletteColor, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ControllersPage = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme();
  const { error } = useNotification();
  const { controllers } = useAppSelector((state) => state.controller)


  const [_openBackDrop, setOpenBackDrop] = useState(false)


  const initFetch = useCallback(() => {
    dispatch(retrieveControllers()).unwrap().then((_res) => {
      setOpenBackDrop(false)
    }).catch(_err => {
      error("Error:")
    })
  }, [dispatch])

  useEffect(() => {
    setOpenBackDrop(true)
    initFetch()
  }, [initFetch])

  const columns: GridColDef[] = [
    { field: 'name', headerClassName: 'super-app-theme--header', headerName: 'Nombre', flex: 1, renderHeader: () => (<strong>Nombre</strong>), },
    { field: 'controllerId', headerClassName: 'super-app-theme--header', headerName: 'id del Controlador', flex: 1 },
    {
      field: 'connected', headerClassName: 'super-app-theme--header', headerName: 'Estado', flex: 1, renderCell: (params) => (
        <Box sx={
          {
            width: 10,
            height: 10,
            backgroundColor: params.row.connected ? "green" : "red",
            borderRadius: "50%"
          }
        }></Box>
      )
    },
    {
      field: 'variables', headerClassName: 'super-app-theme--header', headerName: 'Numero de variables', flex: 1, valueGetter: (params) => {
        // Verifica si el campo "controller" existe en la fila
        return params.row.variables.length
      },
    },
    {
      field: 'customer', headerClassName: 'super-app-theme--header', headerAlign: "center", headerName: 'Compañia', flex: 1, renderCell: (params) => {
        if (params.value) {
          const companyUrl = `/customers/${params.value._id}`; // Asegúrate de tener una propiedad "id" en el objeto "customer"
          return (
            <Link to={companyUrl} className="tw-no-underline tw-text-inherit tw-transition-transform tw-transform tw-hover:scale-110">
              {params.value.name}
            </Link>
          );
        }
        return "Admin"
      }
    },
    // {
    //   field: 'created', headerClassName: 'super-app-theme--header', headerName: 'Fecha de Creación', flex: 1, valueFormatter: (params) => {
    //     const date = new Date(params.value as string);
    //     const formattedDate = new Intl.DateTimeFormat('es-ES', {
    //       year: 'numeric',
    //       month: 'long',
    //       day: '2-digit',
    //     }).format(date);
    //     return formattedDate;
    //   },
    // },

  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title='Controladores' />
      <Box
        sx={{
          width: '100%',
          '& .MuiDataGrid-columnHeaderTitle': { fontWeight: "bold" },
          '& .super-app-theme--header': {
            backgroundColor: theme.palette.primary["200" as keyof PaletteColor],
            fontWeight: "bold"
          },
          '& .odd': {
            //@ts-ignore
            background: theme.palette.neutral["10" as keyof PaletteColor],
          }
        }}>
        {controllers && controllers.length > 0 ? <DataGrid rows={controllers} columns={columns} getRowId={(row) => row._id} getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        } /> : <Typography variant="body1">Aun no hay controladores registrados </Typography>}

      </Box>
    </Box>
  )
}

export default ControllersPage
