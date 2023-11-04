import Form from "@app/components/Form";
import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { doCreateController, doDeleteController } from "@app/store/slices/controllerSlice";
import { retrieveControllerTypes } from "@app/store/slices/controllerTypeSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Controller {
  name: string;
  controllerId: string
  _id: string;
  lastPingTime: string;
  connected: boolean;
  variables: [];
  controllerType: string;
}

interface ControllersTableProps {
  controllers?: Controller[];

}


const ControllersTable: React.FC<ControllersTableProps> = ({ controllers }) => {

  const { id: customer } = useParams()
  const { success, error, info } = useNotification()
  const dispatch = useAppDispatch()
  const {controllerTypes} = useAppSelector((state) => state.controllerType)


  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Controller | null>(null)
  const [customerControllers, setCustomerControllers] = useState<Controller[] | undefined>([]);
  console.log("🚀 ~ file: ControllersTable.tsx:40 ~ customerControllers:", customerControllers)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [controllerToDelete, setControllerToDelete] = useState<Controller | null>(null);
  const [controllerType, setControllerType] = useState("")

  useEffect(() => {
    setCustomerControllers(controllers)
    dispatch(retrieveControllerTypes())
  }, [])

  const handleFormSubmit = (values: any) => {
    setLoading(true);
    dispatch(doCreateController({ ...values, customer, controllerType }))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          setCustomerControllers((current) => {
            const newArray = current || [];
            // @ts-ignore
            return [...newArray, res.data];
          });
          setOpenDialog(false);
          success("Plantilla Creada con éxito");
        } else {
          error("La respuesta es indefinida o no contiene la propiedad 'data'.");
        }
      })
      .catch((err) => {
        error("Error al crear la plantilla: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };



  const onEditController = (_values: any) => {
    info("Pendiente la edicion")
    setOpenDialog(false);
  }

  const handleEditClick = (controller: Controller) => {
    // setUserInDialog(user);
    setEditItem(controller)
    setOpenDialog(true);
  };

  const handleDeleteControllerClick = (controller: Controller) => {
    setControllerToDelete(controller)
    setIsDeleteConfirmationOpen(true);
  };

  const handleCancel = () => {
    setOpenDialog(false)
    setEditItem(null)
  }

  const onDeleteController = (_id: string) => {

    dispatch(doDeleteController(_id))
      .unwrap()
      .then(res => {
        if (res !== undefined) {
          setCustomerControllers((current) => {
            // Filtra la matriz para excluir el controlador a eliminar
            const newArray = current || [];
            const updatedControllers = newArray.filter((controller) => controller._id !== res.data._id);
            return updatedControllers;
          });
          setControllerToDelete(null); // Restablece el usuario que se va a eliminar
          setIsDeleteConfirmationOpen(false);
          setLoading(true)
        }
      })
  }

  const handleChange = (event: SelectChangeEvent) => {
    setControllerType(event.target.value as string);
  };

  const formFields = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      value: '',
    },
    {
      name: 'controllerType',
      label: 'Tipo de Controlador',
      type: 'component',
      required: true,
      value: '',
      component: (
        <Select
            labelId="controllerTypes"
            id="controllerTypes"
            value={controllerType}
            label="Tipo de Controlador"
            onChange={handleChange}
            fullWidth
          >
            {controllerTypes.map(controllerType => <MenuItem key={controllerType._id} value={controllerType._id}>{controllerType.name}</MenuItem>)}
          </Select>
      )
    },

  ];


  return (
    <div>
      <Button color='secondary' variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nuevo Controlador
      </Button>
      {customerControllers && customerControllers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                Nombre
                </TableCell>
                <TableCell>Id del Controlador</TableCell>
                <TableCell>Tipo de Controlador</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Numero de Variables</TableCell>
                {/* <TableCell>Last Ping</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {customerControllers.map((controller) => (
                <TableRow key={controller._id}>
                  <TableCell><Link to={`controller/${controller.controllerType}`}>{controller.name}</Link></TableCell>
                  <TableCell>{controller.controllerId}</TableCell>
                  <TableCell>{controllerTypes.find(controllerType => controllerType._id === controller.controllerType)?.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: controller.connected ? "green" : "red"
                      }}>
                    </Box>
                  </TableCell>
                  <TableCell>{controller.variables.length}</TableCell>
                  {/* <TableCell><span>{new Date(controller.lastPingTime).toLocaleString()}</span></TableCell> */}
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(controller)} color="secondary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteControllerClick(controller)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No hay controladores registrados para esta empresa.</Typography>
      )}
      <Form fields={formFields} handleSubmit={handleFormSubmit} open={openDialog} onClose={() => setOpenDialog(false)} handleCancel={handleCancel} loading={loading} editItem={editItem as Record<string, string> | null} handleEdit={onEditController} />

      <Dialog open={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar a {controllerToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsDeleteConfirmationOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onDeleteController(controllerToDelete?._id || '')}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

    </div>


  )
}

export default ControllersTable
