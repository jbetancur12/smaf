import Form from '@app/components/Form';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { useNotification } from '@app/services/notificationService';
import { doSignUp } from '@app/store/slices/authSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SignUpFormData, User } from '../CustomerPage';



interface UsersTableProps {
  users: User[];

}

const formFields = [
  {
    name: 'firstName',
    label: 'Nombre',
    type: 'text',
    required: true,
    value: '',
  },
  {
    name: 'lastName',
    label: 'Apellido',
    type: 'text',
    required: true,
    value: '',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    value: '',
  },
];

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {

  const { id: customer } = useParams()
  const [openDialog, setOpenDialog] = useState(false);
  const [customerUsers, setCustomerUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editItem, setEditItem] = useState<Record<string, string> | null>(null)

  const dispatch = useAppDispatch()
  const { success, error, info } = useNotification()

  useEffect(() => {
    setCustomerUsers(users)
  }, [])


  const onCreateUser = (values: SignUpFormData) => {
    dispatch(doSignUp(values))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          setCustomerUsers((current) => [...current, res.user])
          //setUserInDialog({ id: "", firstName: '', lastName: '', email: '', password: "initialPassword123456" })
          setLoading(false)
          setOpenDialog(false);
          success("Usuario Creado con exito")
        }
        // setOpen(false)

      })
      .catch((err) => {
        error(err.message)
      })
  }

  const onEditUser = (_values: any) => {
    info("Pendiente la edicion")
    setOpenDialog(false);
  }

  const onDeleteUser = (_id: string) => {
    setUserToDelete(null); // Restablece el usuario que se va a eliminar
    setIsDeleteConfirmationOpen(false);
    info("Pendiente la eliminacion")
  }


  const handleEditClick = (user: any) => {
    // setUserInDialog(user);
    setEditItem(user)
    setOpenDialog(true);
  };

  const handleDeleteUserClick = (_user: User) => {
    setIsDeleteConfirmationOpen(true);
  };



  const myHandleFormSubmit = (values: any) => {
    // Aquí puedes realizar la lógica con los datos del formulario
    setLoading(true)
    onCreateUser({ ...values, password: "initialPassword", customer });
  };

  const handleCancel = () => {
    setOpenDialog(false)
    setEditItem(null)
  }

  return (
    <div>
      <Button variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nuevo Usuario
      </Button>
      {customerUsers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.firstName + ' ' + user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUserClick(user)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No hay usuarios registrados para esta empresa.</Typography>
      )}

      <Form fields={formFields} handleSubmit={myHandleFormSubmit} open={openDialog} onClose={() => setOpenDialog(false)} handleCancel={handleCancel} loading={loading} editItem={editItem} handleEdit={onEditUser} />

      <Dialog open={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar a {userToDelete?.firstName}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsDeleteConfirmationOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onDeleteUser(userToDelete?.id || '')}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersTable;
