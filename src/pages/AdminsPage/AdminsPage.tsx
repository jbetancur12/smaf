import Form from '@app/components/Form';
import Header from '@app/components/Header';
import Select from '@app/components/Select';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { readToken } from '@app/services/localStorage.service';
import { useNotification } from '@app/services/notificationService';
import { doSignUp } from '@app/store/slices/authSlice';
import { doDeleteUser, retrieveUsers } from '@app/store/slices/usersSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, PaletteColor, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { SignUpFormData, User } from '../CustomersPage/CustomerPage/CustomerPage';




const AdminsPage = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme();

  const [_openBackDrop, setOpenBackDrop] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectValue, setSelectValue] = useState("")
  const [selectValueCustomer, setSelectValueCustomer] = useState("")

  const { success, error, info } = useNotification();
  const { users } = useAppSelector((state) => state.users)
  const user = useAppSelector((state) => state.user.user)


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
      name: 'role',
      label: 'Role',
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
    {
      name: 'customer',
      label: 'Customer',
      type: 'component',
      required: true,
      component: (
        <Select
          endpoint={`${import.meta.env.VITE_REACT_APP_BASE_URL}api/customers`}
          token={readToken()}
          label="compañias"
          mapOption={(data) =>
            data.map((item: Record<string, string>) => ({
              _id: item._id,
              name: item.name,
            }))}
          getOptionLabel={(option: Record<string, string>) => option.name}
          onClientSelection={e => setSelectValueCustomer(e?._id || "")}
        />
      ),
      value: null,
    },
  ];


  const handleEditCustomer = (user: any) => {
    setEditItem(user)
    setOpenDialog(true);
  };


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
    { field: 'firstName', headerClassName: 'super-app-theme--header', headerName: 'Nombre', flex: 1, renderHeader: () => (<strong>Nombre</strong>), },
    { field: 'lastName', headerClassName: 'super-app-theme--header', headerName: 'Apellido', flex: 1 },
    { field: 'email', headerClassName: 'super-app-theme--header', headerName: 'Email', flex: 1 },
    {
      field: 'verified', headerClassName: 'super-app-theme--header', headerName: 'Verificado', flex: 1, renderCell: (params) => (
        <Box sx={
          {
            width: 10,
            height: 10,
            backgroundColor: params.row.verified ? "green" : "orange",
            borderRadius: "50%"
          }
        }></Box>
      )
    },
    {
      field: 'customer', headerClassName: 'super-app-theme--header', headerAlign: "center", headerName: 'Compañia', flex: 1, valueFormatter: (params) => {
        if (params.value) {
          return params.value.name
        }
        return "Admin"
      }
    },
    {
      field: 'created', headerClassName: 'super-app-theme--header', headerName: 'Fecha de Creación', flex: 1, valueFormatter: (params) => {
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
      headerClassName: 'super-app-theme--header',
      headerName: 'Acciones',
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
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
              disabled={params.row.id === user?.id}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
    },
  ];

  const myHandleFormSubmit = (values: any) => {

    // Aquí puedes realizar la lógica con los datos del formulario
    setLoading(true)
    if (selectValueCustomer.length > 0) {
      onCreateUser({ ...values, password: "initialPassword", roles: [selectValue], customer: selectValueCustomer });
    } else {
      // Aquí puedes manejar la lógica en caso de que selectValueCustomer esté vacío
      // Por ejemplo, mostrar un mensaje de error o realizar alguna otra acción
      onCreateUser({ ...values, password: "initialPassword", roles: [selectValue] });
    }
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
    setUserToDelete(_user)
    setIsDeleteConfirmationOpen(true);
  };

  const onDeleteUser = (_id: string) => {
    setUserToDelete(null); // Restablece el usuario que se va a eliminar
    setIsDeleteConfirmationOpen(false);
    dispatch(doDeleteUser(_id))
    success("Usuario eliminado exitosamente")
  }


  return (
    <Box m="1.5rem 2.5rem">
      <Header title='Usuarios Administradores' />
      <Button variant="contained" color='secondary' className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nuevo Usuario
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
        <DataGrid rows={users} columns={columns} getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        } />
      </Box>
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
            color="secondary"
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
