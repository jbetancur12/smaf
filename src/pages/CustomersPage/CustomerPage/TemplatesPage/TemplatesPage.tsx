import { TemplateDataResponse } from "@app/api/template.api"
import { VariableDataResponse } from "@app/api/variable.api"
import Header from "@app/components/Header"
import { useAppDispatch } from "@app/hooks/reduxHooks"
import { useNotification } from "@app/services/notificationService"
import { retrieveTemplate } from "@app/store/slices/templateSlice"
import { doCreateVariable, doDeleteVariable, doUpdateVariable } from "@app/store/slices/variableSlice"
import { ContentCopy } from "@mui/icons-material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useCopyToClipboard } from "usehooks-ts"
import VariableForm, { VariableFormData } from "./components/VariableForm"

const TemplatesPage = () => {
  const [template, setTemplate] = useState<Partial<TemplateDataResponse>>({})
  const [variables, setVariables] = useState<VariableDataResponse[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingVariable, setEditingVariable] = useState<VariableFormData>();
  const [variableToDelete, setVariableToDelete] = useState<any>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    sensorType: '',
    unit: '',
    virtualPin: '',
    typePin: '',
  });



  const dispatch = useAppDispatch()
  const { success, error, info } = useNotification();
  const [_value, copy] = useCopyToClipboard()

  let { id, idTemplate } = useParams()

  const fetchTemplate = () => {
    dispatch(retrieveTemplate(idTemplate))
      .unwrap()
      .then((res) => {
        setTemplate(res)

        // @ts-ignore
        setVariables(res.variables)
      })
  }

  useEffect(() => {
    fetchTemplate()
  }, [])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'sensorType', headerName: 'Tipo de Sensor', flex: 1 },
    { field: 'unit', headerName: 'Unidad', flex: 1 },
    { field: 'virtualPin', headerName: 'Pin Virtual', flex: 1 },
    { field: 'typePin', headerName: 'Tipo de Pin', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleEditVariable(params.row)}
            className='tw-mr-2 '
            color='warning'
          >
            <EditIcon/>
          </Button>
          <Button
            onClick={() => handleDeleteVariable(params.row)}
            color='error'
          >
            <DeleteIcon/>
          </Button>
        </>
      ),
    },
  ];

  const handleEditVariable = (variable: any) => {
    setEditingVariable(variable)
    setIsEditing(true)
    setIsModalOpen(true)


  }

  const handleDeleteVariable = (params: Record<string, string>) => {
    setVariableToDelete(params);
    setIsConfirmationOpen(true)

  }

  const confirmDeleteVariable = () => {
    dispatch(doDeleteVariable(variableToDelete._id))
      .unwrap()
      .then((_data) => {
        const updatedVariables = variables.filter((item) => item._id !== variableToDelete._id)
        setVariables(updatedVariables)
        success(`Variable ${variableToDelete.name} eliminada con exito`)
        setIsConfirmationOpen(false);
      })
      .catch((err) => {
        error(err.message)
      })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false)
  };

  const handleFormSubmit = (values: any) => {
    dispatch(doCreateVariable({ ...values, customer: id, template: idTemplate }))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          setVariables((current) => [...current, res.data])
          setIsModalOpen(false)
          success("Compañia creada con exito")
        }
      })
      .catch((err) => {
        error(err.message)
      })

  }

  const handleFormEdit = (values: any) => {
    dispatch(doUpdateVariable({id:values._id, data:values}))
    .unwrap()
    .then((data:VariableDataResponse) => {

      // setVariables(data)
      const updatedVariables:VariableDataResponse[] = variables.map((item) =>{
        if(item._id === data._id){
          return data
        }else{
          return item
        }


      })

      setVariables(updatedVariables)
      success(`Variable actualizada con exito`)
      setIsModalOpen(false);
    })
    .catch((err) => {
      error(err.message)
    })
  }

  const handleCellClick = (value:string|undefined) => {
    //@ts-ignore
    copy(value);
    info("Id copiado al portapapeles")
  };


  return (
    <Box m="1.5rem 2.5rem">
      <Header title={template.name} />
      <TableContainer className="tw-mb-4">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Id Customer: </strong></TableCell>
              <TableCell onClick={()=> handleCellClick(template.customer)}>{template.customer} <ContentCopy className="tw-cursor-pointer"/></TableCell>
              <TableCell ><strong>Id Template: </strong></TableCell>
              <TableCell onClick={()=> handleCellClick(template._id)}>{template._id} <ContentCopy className="tw-cursor-pointer"/></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={() => setIsModalOpen(true)} sx={{ width: 'fit-content' }} className="tw-mb-3">
        Crear Nueva Variable
      </Button>
      {template.variables && template.variables.length > 0 ? (
        <DataGrid rows={variables} columns={columns} getRowId={(row) => row._id} />
      ) : (
        <Typography variant="body1">No hay usuarios registrados para esta empresa.</Typography>
      )}
      <Modal open={isModalOpen} onClose={handleCancel}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#FFF', padding: '1rem', borderRadius: 12 }}>
          <h2>Crear Nueva Variable</h2>
          <VariableForm onCancel={handleCancel} onSubmit={handleFormSubmit} formData={formData} setFormData={setFormData} isEditing={isEditing} editingVariable={editingVariable} setEditingVariable={setEditingVariable} onEdit={handleFormEdit}/>
        </div>
      </Modal>
      <Modal open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#FFF', padding: '1rem', borderRadius: 12 }}>
          <h2>Confirmar Eliminación</h2>
          <p>¿Está seguro de que desea eliminar la compañía {variableToDelete?.name || ''}?</p>
          <Button variant="contained" onClick={confirmDeleteVariable}>
            Confirmar
          </Button>
          <Button variant="outlined" onClick={() => setIsConfirmationOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>

    </Box>
  )
}

export default TemplatesPage
