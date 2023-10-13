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
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { SignUpFormData, User } from '../CustomerPage';



interface UsersTableProps {
  users: User[];

}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInDialog, setUserInDialog] = useState<User>({ id: "", firstName: '', lastName: '', email: '', password: "" });
  const dispatch = useAppDispatch()
  const {success, error} = useNotification()


  const onCreateUser = (values: SignUpFormData) => {
    dispatch(doSignUp(values))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          // setUsers((current) => [...current, res.user])
          setUserInDialog({ id: "", firstName: '', lastName: '', email: '', password: "" })
          setOpenDialog(false);
          success("Usuario Creado con exito")
        }
        // setOpen(false)

      })
      .catch((err) => {
        error(err.message)
      })
  }

  const onEditUser = (values: User) => {

  }

  const onDeleteUser = (id: string) => {

  }

  const handleCreateUser = () => {

    onCreateUser(userInDialog);


  };

  const handleEditUser = (user:User) => {
    onEditUser(user);
    setOpenDialog(false);
  };



  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInDialog({
      ...userInDialog,
      [e.target.name]: e.target.value,
    });
  }

  const handleCancel = () => {
    setOpenDialog(false)
    setUserInDialog({ id: "", firstName: '', lastName: '', email: '', password: "" });
  }

  return (
    <div>
      <Button variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nuevo Usuario
      </Button>
      {users.length > 0 ? (
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
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.firstName + ' ' + user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                  <IconButton onClick={() => setUserInDialog(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteUser(user.id)} color="error">
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{userInDialog ? 'Crear Usuario' : 'Editar Usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name='firstName'
            fullWidth
            value={userInDialog?.firstName || ""}
            onChange={handleOnChange}
          />
          <TextField
            label="Apellido"
            name="lastName"
            fullWidth
            value={userInDialog?.lastName || ""}
            onChange={handleOnChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={userInDialog?.email || ""}
            onChange={handleOnChange}
          />
          <TextField
            label="Password"
            name="password"
            fullWidth
            value={userInDialog?.password || ""}
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={userInDialog.id.length === 0 ? handleCreateUser : () => handleEditUser(userInDialog)}
          >

            {userInDialog ? 'Crear' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersTable;
