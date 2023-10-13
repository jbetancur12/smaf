import { TemplateDataResponse } from '@app/api/template.api';
import Form from '@app/components/Form';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { useNotification } from '@app/services/notificationService';
import { doCreateTemplate } from '@app/store/slices/templateSlice';
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




interface TemplatesTableProps {
  templates: TemplateDataResponse[];

}

const formFields = [
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    required: true,
    value: '',
  },
  {
    name: 'description',
    label: 'Decripción',
    type: 'text',
    required: true,
    value: '',
  },
  {
    name: 'type',
    label: 'Tipo',
    type: 'text',
    required: true,
    value: 'graph',
  },
];

const TemplatesTable: React.FC<TemplatesTableProps> = ({ templates }) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [customerTemplates, setCustomerTemplates] = useState<TemplateDataResponse[]>([]);
  const [id, setId] = useState<string>("");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Record<string, string> | null>(null)

  const dispatch = useAppDispatch()
  const { id: customer } = useParams()


  const {success, error, info} = useNotification()

  useEffect(()=>{
    setCustomerTemplates(templates)
  },[])


  const onCreateTemplate = (values: any) => {
    setLoading(true)
    dispatch(doCreateTemplate({...values, customer}))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          setCustomerTemplates((current) => [...current, res.data])
          setOpenDialog(false);
          success("Plantilla Creada con exito")
          setLoading(false)
        }

      })
      .catch((err) => {
        error(err.message)
      })
  }

  const onEditTemplate = () => {
    info("Pendiente la edicion")
    setOpenDialog(false);
  }

  const onDeleteUser = (id: string) => {
    setIsDeleteConfirmationOpen(false);
    info("Pendiente la eliminacion")
  }


  const handleCancel = () => {
    setOpenDialog(false)
    setEditItem(null)
  }

  const handleEditClick = (template: any) => {
    // setUserInDialog(user);
    setEditItem(template)
    setOpenDialog(true);
  };


  const handleDeleteUserClick = (template: TemplateDataResponse) => {
    setIsDeleteConfirmationOpen(true);
  };

  return (
    <div>
      <Button variant="contained" className="tw-mb-4" onClick={() => setOpenDialog(true)}>
        Nueva Plantilla
      </Button>
      {customerTemplates.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Tipo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerTemplates.map((template, index) => (
                <TableRow key={index}>
                  <TableCell>{template._id}</TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.type}</TableCell>
                  <TableCell>
                  <IconButton onClick={() => handleEditClick(template)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUserClick(template)} color="error">
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
    <Form
          open={openDialog}
          onClose={()=>setOpenDialog(false)}
          fields={formFields}
          handleSubmit={onCreateTemplate}
          handleCancel={handleCancel}
          handleEdit={onEditTemplate}
          loading={loading}
          editItem={editItem}
          />
      <Dialog open={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar a {templateToDelete?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsDeleteConfirmationOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onDeleteUser(templateToDelete?._id || '')}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TemplatesTable;
