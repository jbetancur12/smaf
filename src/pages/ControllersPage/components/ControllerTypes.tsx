
import Form from "@app/components/Form";
import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { doCreateControllerType, retrieveControllerTypes } from "@app/store/slices/controllerTypeSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, PaletteColor, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ControllerTypes = () => {

  const theme = useTheme();
  const { success, error, info } = useNotification()
  const dispatch = useAppDispatch()
  const { controllerTypes } = useAppSelector((state) => state.controllerType)


  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(retrieveControllerTypes())
  },[])


  const formFields = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      value: '',
    },
  ]

  const columns: GridColDef[] = [
    { field: 'name', headerClassName: 'super-app-theme--header', headerName: 'Nombre', flex: 1, renderHeader: () => (<strong>Nombre</strong>),

    renderCell: (params) => {
      console.log("🚀 ~ file: ControllerTypes.tsx:45 ~ ControllerTypes ~ params:", params)
      if (params.value) {
        const controllerTypeUrl = `/controller-types/${params.row._id}`; // Asegúrate de tener una propiedad "id" en el objeto "customer"
        return (
          <Link to={controllerTypeUrl} className="tw-no-underline tw-text-inherit tw-transition-transform tw-transform tw-hover:scale-110">
            {params.row.name}
          </Link>
        );
      }
      return "Admin"
    }
  },
    {
      field: 'actions',
      headerName: 'Acciones',
      headerClassName: 'super-app-theme--header',
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <>

          <IconButton

            className='tw-mr-2 '
            color='warning'
          >
            <EditIcon />
          </IconButton>
          <IconButton

            color='error'
          >
            <DeleteIcon />
          </IconButton>

        </>
      ),
    },
  ]

  const handleFormSubmit = (values: any) => {
    setLoading(true);
    dispatch(doCreateControllerType(values))
    .unwrap()
    .then((res) => {
      if (res !== undefined) {
        setOpenDialog(false);
        success("Tipo de Controlador Creado con éxito");
      } else {
        error("La respuesta es indefinida o no contiene la propiedad 'data'.");
      }
    })
    .catch((err) => {
      error("Error al crear el tipo de controlador: " + err.message);
    })
    .finally(() => {
      setLoading(false);
    });

  }
  const handleCancel = () => {
    setOpenDialog(false)
    setEditItem(null)
  }

  const onEditUser = (_values: any) => {
    setOpenDialog(false);
  }


  return (
    <div>
      <Button color='secondary' variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nuevo Tipo de Controlador
      </Button>
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
            {controllerTypes && controllerTypes.length > 0 ? <DataGrid rows={controllerTypes} columns={columns} getRowId={(row) => row._id} getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            } /> : <Typography variant="body1">Aun no hay controladores registrados </Typography>}

          </Box>
      <Form fields={formFields} handleSubmit={handleFormSubmit} open={openDialog} onClose={() => setOpenDialog(false)} handleCancel={handleCancel} loading={loading} editItem={editItem} handleEdit={onEditUser} />
    </div>
  )
}

export default ControllerTypes
