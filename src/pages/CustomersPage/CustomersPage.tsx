import { CustomerData } from '@app/api/customer.api';
import Header from '@app/components/Header';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useNotification } from '@app/services/notificationService';
import { doCreateCustomer, doDeleteCustomer, doUpdateCustomer, retrieveCustomers } from '@app/store/slices/customerSlice';
import { Equalizer, Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Backdrop, Box, Button, CircularProgress, IconButton, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerForm, { CustomerFormData } from './components/CustomerForm';

const Customers: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { success, error } = useNotification();
  const { customers } = useAppSelector((state) => state.customer)

  const [customerToDelete, setCustomerToDelete] = useState<any>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerFormData | null>(null);
  const [loading, setLoading] = useState(false)
  const [openBackDrop, setOpenBackDrop] = useState(false)


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    IdCustomer: "",
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address1: '',
  });

  const handleCreateCustomer = () => {
    // Lógica para abrir el modal de creación de un nuevo customer
    dispatch(doCreateCustomer(formData))
      .unwrap()
      .then((_res) => {
        success("Compañia creada con exito")
        setIsModalOpen(false);
      })
      .catch((err) => {
        error(err.message)
        // setLoading(false)
        setIsModalOpen(false);
      })

  };

  const handleUpdateCustomer = () => {
    dispatch(doUpdateCustomer({ id: editingCustomer?._id, data: editingCustomer as CustomerData }))
      .unwrap()
      .then((_res) => {
        handleCancel()
        success("Compañia editada con éxito")
      })
      .catch((err) => {
        error(err.message)
      })

  }

  const handleDeleteCustomer = (customer: any) => {
    setCustomerToDelete(customer);
    setIsConfirmationOpen(true);
  };



  const handleEditCustomer = (customer: CustomerFormData) => {
    setEditingCustomer(customer);
    setIsEditing(true);
    setIsModalOpen(true);
  };


  const confirmDeleteCustomer = () => {
    if (customerToDelete) {
      dispatch(doDeleteCustomer(customerToDelete._id))
        .unwrap()
        .then((data) => {
          success(`Compañía ${data.name} eliminada con éxito`);
          setIsConfirmationOpen(false);
        })
        .catch((err) => {
          error(err.message);
        });
    }
  };


  const handleFormSubmit = () => {
    // Lógica para guardar el nuevo customer (formData) en la lista de customers
    // También puedes cerrar el modal aquí

    if (isEditing) {
      handleUpdateCustomer()
    } else {
      handleCreateCustomer()
    }
    handleCancel()
  };

  const handleCancel = () => {
    setFormData({
      id: 0,
      name: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
    });

    setEditingCustomer(null); // Restablece el cliente en edición
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const initFetch = useCallback(() => {
    dispatch(retrieveCustomers()).unwrap().then((_res) => {
      setLoading(false)
      setOpenBackDrop(false)
    }).catch(_err => {
      error("Error:")
    })
  }, [dispatch])

  useEffect(() => {
    setLoading(true)
    setOpenBackDrop(true)
    initFetch()
  }, [initFetch])

  console.log(customers)
  const columns: GridColDef[] = [
    // { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'createdAt', headerName: 'Fecha de creación', flex: 1, valueFormatter: (params) => {
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
      field: 'activeSubscription', headerName: 'Subscrito', flex: 1, renderCell: (params) => {
        const subscriptionEndDate = new Date(params.row.activeSubscription.endDate);
        const currentDate = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
        if (params.row.activeSubscription.isActive) {
          const date = new Date(params.row.activeSubscription.endDate as string);
          const bencido = subscriptionEndDate <= thirtyDaysFromNow ? "red" : "green";

          const formattedDate = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          }).format(date);
          return <div className='tw-flex tw-flex-col'><div>Si</div><div className='tw-mb-1' style={{ color: bencido }}>
            <strong> {formattedDate}</strong>
          </div></div>
        } else {
          return <div className='tw-flex  tw-flex-col'>No</div>
        }
      }
    },
    {
      field: 'trialPeriod', headerName: 'Prueba', flex: 1, renderCell: (params) => {
        const trialEndDate = new Date(params.row.trialPeriod.trialEndDate);
        const currentDate = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
        if (params.row.trialPeriod.isOnTrial) {
          const date = new Date(params.row.trialPeriod.trialEndDate as string);
          const bencido = trialEndDate <= thirtyDaysFromNow ? "red" : "green";

          const formattedDate = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          }).format(date);
          return <div className='tw-flex tw-flex-col'><div>Si</div><div className='tw-mb-1' style={{ color: bencido }}>
            <strong> {formattedDate}</strong>
          </div></div>
        } else {
          return <div className='tw-flex  tw-flex-col'>No</div>
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`${params.row._id}`)}>
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => handleEditCustomer(params.row)}
            className='tw-mr-2 '
            color='warning'
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteCustomer(params.row)}
            color='error'
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/templates?customer=${params.row._id}`)} color="info">
            <Equalizer />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem" sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem 2.5rem',
    }}>
      <Header title='Compañias' />
      <Button variant="contained" onClick={() => setIsModalOpen(true)} sx={{ width: 'fit-content' }} color='secondary'>
        Crear Nueva Compañia
      </Button>
      <Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackDrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {!loading ? (<DataGrid rows={customers} columns={columns} getRowId={(row) => row._id} />) : "..."}
      </Box>
      <Modal open={isModalOpen} onClose={handleCancel}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#FFF', padding: '1rem', borderRadius: 12 }}>
          <h2>Crear Nueva Compañia</h2>
          <CustomerForm onCancel={handleCancel} onSubmit={handleFormSubmit} formData={formData} setFormData={setFormData} isEditing={isEditing} editingCustomer={editingCustomer} setEditingCustomer={setEditingCustomer} />
        </div>
      </Modal>
      <Modal open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#FFF', padding: '1rem', borderRadius: 12 }}>
          <h2>Confirmar Eliminación</h2>
          <p>¿Está seguro de que desea eliminar la compañía {customerToDelete?.name || ''}?</p>
          <Button variant="contained" onClick={confirmDeleteCustomer}>
            Confirmar
          </Button>
          <Button variant="outlined" onClick={() => setIsConfirmationOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>

    </Box>
  );
};

export default Customers;

