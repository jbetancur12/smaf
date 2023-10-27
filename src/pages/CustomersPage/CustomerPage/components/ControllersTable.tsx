import Form from "@app/components/Form";
import { useAppDispatch } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { doCreateController, doDeleteController } from "@app/store/slices/controllerSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Controller {
  name: string;
  controllerId: string
  _id: string;
  lastPingTime: string;
  connected: boolean
}

interface ControllersTableProps {
  controllers?: Controller[];

}

const formFields = [
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    required: true,
    value: '',
  },

];

const ControllersTable: React.FC<ControllersTableProps> = ({ controllers }) => {

  const { id: customer } = useParams()
  const { success, error, info } = useNotification()
  const dispatch = useAppDispatch()

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Controller | null>(null)
  const [customerControllers, setCustomerControllers] = useState<Controller[] | undefined>([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [controllerToDelete, setControllerToDelete] = useState<Controller | null>(null);

  useEffect(() => {
    setCustomerControllers(controllers)
  }, [])

  const handleFormSubmit = (values: any) => {
    setLoading(true);
    dispatch(doCreateController({ ...values, customer }))
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


  return (
    <div>
      <Button color='secondary' variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        NuevoControlador
      </Button>
      {customerControllers && customerControllers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Id del Controlador</TableCell>
                <TableCell>Estado</TableCell>
                {/* <TableCell>Last Ping</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {customerControllers.map((controller) => (
                <TableRow key={controller._id}>
                  <TableCell>{controller.name}</TableCell>
                  <TableCell>{controller.controllerId}</TableCell>
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
