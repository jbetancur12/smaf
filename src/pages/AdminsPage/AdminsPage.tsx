import Form from '@app/components/Form';
import Header from '@app/components/Header';
import Select from '@app/components/Select';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { readToken } from '@app/services/localStorage.service';
import { useNotification } from '@app/services/notificationService';
import { doSignUp } from '@app/store/slices/authSlice';
import { retrieveUsers } from '@app/store/slices/usersSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { SignUpFormData, User } from '../CustomersPage/CustomerPage/CustomerPage';




const AdminsPage = () => {
  const dispatch = useAppDispatch()

  const [openBackDrop, setOpenBackDrop] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectValue, setSelectValue]= useState("")

  const { success, error, info } = useNotification();
  const { users  } = useAppSelector((state) => state.users)


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
    {
      name: 'avatar',
      label: 'Avatar',
      type: 'component',
      required: true,
      component: (
        <Select
          endpoint={`${import.meta.env.VITE_REACT_APP_BASE_URL}api/roles`}
          token={readToken()}
          label="Rol"
          mapOption={(data) =>
            data.map((item: Record<string, string>) => ({
              _id: item._id,
              name: item.name,
            }))}
            getOptionLabel={(option: Record<string, string>) => option.name}
            onClientSelection={e => setSelectValue(e?.name || "")}
          />
      ),
      value: null,
    },
  ];


  const handleEditCustomer = (user: any) => {
    setEditItem(user)
    setOpenDialog(true);
  };

  const handleUpdateCustomer = () => {


  }
console.log(selectValue)

  const initFetch = useCallback(() => {
    dispatch(retrieveUsers()).unwrap().then((_res) => {
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
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'firstName', headerName: 'Nombre', flex: 1 },
    { field: 'lastName', headerName: 'Nombre', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'customer', headerName: 'Compañia', flex: 1 },
    {
      field: 'created', headerName: 'Fecha de Creación', flex: 1, valueFormatter: (params) => {
        const date = new Date(params.value as string);
        const formattedDate = new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        }).format(date);
        return formattedDate;
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEditCustomer(params.row)}
            className='tw-mr-2 '
            color='warning'
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteUserClick(params.row)}
            color='error'
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const myHandleFormSubmit = (values: any) => {
    console.log("🚀 ~ file: AdminsPage.tsx:147 ~ myHandleFormSubmit ~ values:", values)
    // Aquí puedes realizar la lógica con los datos del formulario
    setLoading(true)
    onCreateUser({ ...values, password: "initialPassword", roles: [selectValue] });
  };

  const handleCancel = () => {
    setOpenDialog(false)
    setEditItem(null)
  }

  const onEditUser = (_values: any) => {
    info("Pendiente la edicion")
    setOpenDialog(false);
  }

  const onCreateUser = (values: SignUpFormData) => {
    console.log("🚀 ~ file: AdminsPage.tsx:163 ~ onCreateUser ~ values:", values)
    dispatch(doSignUp(values))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          // setCustomerUsers((current) => [...current, res.user])
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

  const handleDeleteUserClick = (_user: User) => {
    setIsDeleteConfirmationOpen(true);
  };

  const onDeleteUser = (_id: string) => {
    setUserToDelete(null); // Restablece el usuario que se va a eliminar
    setIsDeleteConfirmationOpen(false);
    info("Pendiente la eliminacion")
  }


  return (
    <Box m="1.5rem 2.5rem">
      <Header title='Usuarios Administradores' />
      <Button variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nuevo Usuario
      </Button>
      <DataGrid rows={users} columns={columns}  />
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
    </Box>
  )
}

export default AdminsPage
