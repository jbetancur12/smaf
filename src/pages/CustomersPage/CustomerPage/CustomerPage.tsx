import { CustomerDataResponse } from "@app/api/customer.api"
import { TemplateDataResponse, getCustomerTemplates } from "@app/api/template.api"
import Header from "@app/components/Header"
import { useAppDispatch } from "@app/hooks/reduxHooks"
import { retrieveCustomer } from "@app/store/slices/customerSlice"
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TemplatesTable from "./components/TemplatesTable"
import UsersTable from "./components/UsersTable"



export interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  customer?: string
}

export interface User extends SignUpFormData {
  id: string
}

const CustomerPage = () => {
  let { id } = useParams()
  const dispatch = useAppDispatch()

  const [customer, setCustomer] = useState<Partial<CustomerDataResponse>>({})
  const [templates, setTemplates] = useState<TemplateDataResponse[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState('1'); // '1' representa la primera pestaña por defecto


  const fetchCustomer = () => {
    dispatch(retrieveCustomer(id))
      .unwrap()
      .then((res) => {
        setCustomer(res)
        setUsers(res.users)
      })
  }

  const fetchTemplates = () => {
    getCustomerTemplates(id).then((res) => setTemplates(res))
  }

  useEffect(() => {
    fetchCustomer()
    fetchTemplates()
  }, [])

  return (
    <Box m="1.5rem 2.5rem">
      <Header title={customer.name} />

      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(_e, newValue) => setActiveTab(newValue)}>
            <Tab label="Información del Cliente" value="1" />
            <Tab label="Usuarios" value="2" />
            <Tab label="Plantillas" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>ID de Cliente:</strong></TableCell>
                  <TableCell>{customer.IdCustomer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Email:</strong></TableCell>
                  <TableCell>{customer.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Teléfono:</strong></TableCell>
                  <TableCell>{customer.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>País:</strong></TableCell>
                  <TableCell>{customer.country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Ciudad:</strong></TableCell>
                  <TableCell>{customer.city}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Dirección:</strong></TableCell>
                  <TableCell>{customer.address1}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Fecha de Creación:</strong></TableCell>
                  <TableCell> {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : 'Fecha no disponible'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value="2">
          <UsersTable  users={users}/>
        </TabPanel>

        <TabPanel value="3">
          <TemplatesTable templates={templates}/>
          {/* {templates.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripcion</TableCell>
                    <TableCell>Tipo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template, index) => (
                    <TableRow key={index}>
                      <TableCell>{template._id}</TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>{template.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No hay plantillas registradas para esta empresa.</Typography>
          )} */}
        </TabPanel>
      </TabContext>




    </Box>
  )
}

export default CustomerPage
