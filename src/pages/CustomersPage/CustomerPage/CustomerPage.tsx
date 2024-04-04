import { CustomerDataResponse } from "@app/api/customer.api";
import { httpApi } from "@app/api/http.api";
import {
  TemplateDataResponse,
  getCustomerTemplates,
} from "@app/api/template.api";
import Header from "@app/components/Header";
import Subscription from "@app/components/Subscription";
import { useAppDispatch } from "@app/hooks/reduxHooks";
import { retrieveCustomer } from "@app/store/slices/customerSlice";
import { Cancel, Edit } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ControllersTable from "./components/ControllersTable";
import TemplatesTable from "./components/TemplatesTable";
import UsersTable from "./components/UsersTable";
import LogsActuactors from "@app/components/LogsActuactors";

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  customer?: string;
}

export interface User extends SignUpFormData {
  id: string;
}

const CustomerPage = () => {
  let { id } = useParams();
  const dispatch = useAppDispatch();

  const [customer, setCustomer] = useState<Partial<CustomerDataResponse>>({});
  const [templates, setTemplates] = useState<TemplateDataResponse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("1"); // '1' representa la primera pestaña por defecto

  //Edit dates
  const [hasSubscription, setHasSubscription] = useState(false);

  const [clickEditStartSuscription, setClickEditStartSuscription] =
    useState(false);
  const [startEditSuscription, setStartEditSuscription] =
    useState<Dayjs | null>(null);

  const [clickEditEndSuscription, setClickEditEndSuscription] = useState(false);
  const [endEditSuscription, setEndEditSuscription] = useState<Dayjs | null>(
    null
  );

  const [clickEditStartTrial, setClickEditStartTrial] = useState(false);
  const [startEditionTrial, setStartEditTrial] = useState<Dayjs | null>(null);

  const [clickEditEndTrial, setClickEditEndTrial] = useState(false);
  const [endEditionTrial, setEndEditTrial] = useState<Dayjs | null>(null);

  const fetchCustomer = () => {
    dispatch(retrieveCustomer(id))
      .unwrap()
      .then((res) => {
        httpApi
          .post<any>("api/check-suscriptions/" + res._id)
          .then(({ data }) => {
            setHasSubscription(data.activeSubscription.isActive);
            if (data.activeSubscription?.endDate) {
              setStartEditSuscription(
                dayjs(data.activeSubscription?.startDate)
              );
              setEndEditSuscription(dayjs(data.activeSubscription?.endDate));
            }
            if (data.trialPeriod?.trialEndDate) {
              setStartEditTrial(dayjs(data.trialPeriod?.trialStartDate));
              setEndEditTrial(dayjs(data.trialPeriod?.trialEndDate));
            }
          });
        setCustomer(res);
        setUsers(res.users);
      });
  };

  const editSubscription = (date: Dayjs, frame: "startDate" | "endDate") => {
    httpApi
      .put<any>("api/activate-subscription/" + customer._id, {
        [frame]: date.toDate(),
      })
      .then(({ data }) => {
        if (frame === "startDate") {
          setClickEditStartSuscription(false);
        }
        if (frame === "endDate") {
          setClickEditEndSuscription(false);
        }
        if (data.activeSubscription?.startDate) {
          setStartEditSuscription(dayjs(data.activeSubscription?.startDate));
          setEndEditSuscription(dayjs(data.activeSubscription?.endDate));
        }

        setHasSubscription(data.activeSubscription.isActive);
      });
  };

  const editTrial = (date: Dayjs, frame: "trialStartDate" | "trialEndDate") => {
    httpApi
      .put<any>("api/activate-trial/" + customer._id, {
        [frame]: date.toDate(),
      })
      .then(({ data }) => {
        if (frame === "trialStartDate") setClickEditStartTrial(false);
        if (frame === "trialEndDate") setClickEditEndTrial(false);
        if (data.activeSubscription?.trialStartDate) {
          setStartEditTrial(dayjs(data.trialPeriod?.trialStartDate));
        }
      });
  };

  const fetchTemplates = () => {
    getCustomerTemplates(id).then((res) => setTemplates(res));
  };

  useEffect(() => {
    fetchCustomer();
    fetchTemplates();
    // setStartEditSuscription(customer.activeSubscription?.startDate)
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title={customer.name} />

      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(_e, newValue) => setActiveTab(newValue)}>
            <Tab label="Información del Cliente" value="1" />
            <Tab label="Usuarios" value="2" />
            <Tab label="Plantillas" value="3" />
            <Tab label="Controladores" value="4" />
            <Tab label="Logs" value="5" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>ID de Cliente:</strong>
                  </TableCell>
                  <TableCell>{customer.IdCustomer}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Email:</strong>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Teléfono:</strong>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>País:</strong>
                  </TableCell>
                  <TableCell>{customer.country}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ciudad:</strong>
                  </TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Dirección:</strong>
                  </TableCell>
                  <TableCell>{customer.address1}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Fecha de Creación:</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleString()
                      : "Fecha no disponible"}
                  </TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Variables:</strong>
                  </TableCell>
                  <TableCell> {customer.variables?.length || 0}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell colSpan={2} />
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Suscripción:</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {customer.activeSubscription?.isActive ? "Si" : "No"}
                  </TableCell>
                  {customer.activeSubscription?.isActive ? (
                    <>
                      <TableCell>
                        <strong>Fecha de Inicio:</strong>
                      </TableCell>
                      <TableCell align="center">
                        {startEditSuscription ? (
                          <span>
                            {!clickEditStartSuscription ? (
                              startEditSuscription.toDate().toLocaleDateString()
                            ) : (
                              <DatePicker
                                value={startEditSuscription}
                                onChange={(newValue) =>
                                  setStartEditSuscription(newValue)
                                }
                                onAccept={(s) => {
                                  if (s !== null) {
                                    editSubscription(s, "startDate");
                                  }
                                }}
                              />
                            )}
                            {!clickEditStartSuscription ? (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() =>
                                  setClickEditStartSuscription(true)
                                }
                              >
                                <Edit />
                              </IconButton>
                            ) : (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() =>
                                  setClickEditStartSuscription(false)
                                }
                              >
                                <Cancel />
                              </IconButton>
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        <strong>Fecha de Fin:</strong>
                      </TableCell>
                      <TableCell align="center">
                        {endEditSuscription ? (
                          <span>
                            {!clickEditEndSuscription ? (
                              endEditSuscription.toDate().toLocaleDateString()
                            ) : (
                              <DatePicker
                                value={endEditSuscription}
                                onChange={(newValue) =>
                                  setEndEditSuscription(newValue)
                                }
                                onAccept={(s) => {
                                  if (s !== null) {
                                    editSubscription(s, "endDate");
                                  }
                                }}
                              />
                            )}
                            {!clickEditEndSuscription ? (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() => setClickEditEndSuscription(true)}
                              >
                                <Edit />
                              </IconButton>
                            ) : (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() =>
                                  setClickEditEndSuscription(false)
                                }
                              >
                                <Cancel />
                              </IconButton>
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <TableCell colSpan={4} />
                  )}
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Periodo de Prueba:</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {customer.trialPeriod?.isOnTrial ? "Si" : "No"}
                  </TableCell>
                  {customer.trialPeriod?.trialEndDate ? (
                    <>
                      <TableCell>
                        <strong>Fecha de Inicio:</strong>
                      </TableCell>
                      <TableCell align="center">
                        {customer.trialPeriod?.trialStartDate ? (
                          <span>
                            {!clickEditStartTrial ? (
                              new Date(
                                customer.trialPeriod?.trialStartDate
                              ).toLocaleDateString()
                            ) : (
                              <DatePicker
                                value={startEditionTrial}
                                onChange={(newValue) =>
                                  setStartEditTrial(newValue)
                                }
                                onAccept={(s) => {
                                  if (s !== null) {
                                    editTrial(s, "trialStartDate");
                                  }
                                }}
                              />
                            )}
                            {!clickEditStartTrial ? (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() => setClickEditStartTrial(true)}
                              >
                                <Edit />
                              </IconButton>
                            ) : (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() => setClickEditStartTrial(false)}
                              >
                                <Cancel />
                              </IconButton>
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        <strong>Fecha de Fin:</strong>
                      </TableCell>
                      <TableCell align="center">
                        {customer.trialPeriod?.trialEndDate ? (
                          <span>
                            {!clickEditEndTrial ? (
                              new Date(
                                customer.trialPeriod?.trialEndDate
                              ).toLocaleDateString()
                            ) : (
                              <DatePicker
                                value={endEditionTrial}
                                onChange={(newValue) =>
                                  setEndEditTrial(newValue)
                                }
                                onAccept={(s) => {
                                  if (s !== null) {
                                    editTrial(s, "trialEndDate");
                                  }
                                }}
                              />
                            )}
                            {!clickEditEndTrial ? (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() => setClickEditEndTrial(true)}
                              >
                                <Edit />
                              </IconButton>
                            ) : (
                              <IconButton
                                className="tw-ml-2"
                                onClick={() => setClickEditEndTrial(false)}
                              >
                                <Cancel />
                              </IconButton>
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <TableCell colSpan={4} />
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {customer && Object.keys(customer).length > 0 && (
            <Subscription
              customerId={customer._id}
              hasSubscription={hasSubscription}
              hasTrial={customer.trialPeriod?.isOnTrial}
            />
          )}
        </TabPanel>

        <TabPanel value="2">
          <UsersTable users={users} />
        </TabPanel>

        <TabPanel value="3">
          <TemplatesTable templates={templates} />
        </TabPanel>
        <TabPanel value="4">
          <ControllersTable controllers={customer.controllers} />
        </TabPanel>
        <TabPanel value="5">
          <LogsActuactors customer={customer._id} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default CustomerPage;
