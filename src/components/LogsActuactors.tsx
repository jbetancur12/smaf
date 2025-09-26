import React, { useEffect, useState } from "react";

import { useAppDispatch } from "@app/hooks/reduxHooks";
import { retrieveLogsActuactors } from "@app/store/slices/logsActuactorSlice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Log {
  _id: string;
  option: string;
  actuactor: string;
  user: string;
  customer: string;
  createdAt: string;
  updatedAt: string;
}

interface Request {
  page: number;
  pageSize: number;
  isLoading?: boolean;
  data: Log[];
  total?: number;
}

interface LogsProps {
  customer?: string;
}

const LogsActuactors: React.FC<LogsProps> = ({ customer }) => {
  const dispatch = useAppDispatch();

  const [pageState, setPageState] = useState<Request>({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    setPageState((old) => ({ ...old, isLoading: true }));
    dispatch(
      retrieveLogsActuactors({
        id: customer,
        page: pageState.page,
        pageSize: pageState.pageSize,
      })
    ).then((data) => {
      setPageState({
        ...pageState,
        data: data.payload.logs,
        total: data.payload.total,
        isLoading: false,
      });
    });
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID" },
    { field: "actuactor", headerName: "Actuador", flex: 1 },
    { field: "option", headerName: "Comando", flex: 1 },
    { field: "user", headerName: "Usuario", flex: 1 },
    {
      field: "createdAt",
      headerName: "Fecha y Hora",
      flex: 1,
      valueGetter: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleString();
      },
    },
  ];

  useEffect(() => {
    fetchData();
    setPageState((prevPageState) =>
      pageState.total !== undefined
        ? { ...prevPageState, total: pageState.total }
        : { ...prevPageState, total: prevPageState.total }
    );
  }, [pageState.page, pageState.pageSize]);

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={pageState.data}
        loading={pageState.isLoading}
        columns={columns}
        getRowId={(row) => row._id}
        rowCount={pageState.total}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },

          columns: {
            columnVisibilityModel: {
              _id: false,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        onPaginationModelChange={(params) => {
          setPageState((old) => ({
            ...old,
            page: params.page + 1,
            pageSize: params.pageSize,
          }));
        }}
        paginationMode="server"
        //paginationModel={paginationModel}
      />
    </div>
  );
};

export default LogsActuactors;
