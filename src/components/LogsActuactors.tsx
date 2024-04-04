import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { retrieveLogsActuactors } from "@app/store/slices/logsActuactorSlice";

interface Log {
  _id: string;
  option: string;
  actuactor: string;
  user: string;
  customer: string;
  createdAt: string;
  updatedAt: string;
}

interface LogsProps {
  customer?: string;
}

const LogsActuactors: React.FC<LogsProps> = ({ customer }) => {
  const dispatch = useAppDispatch();

  const [logs, setLogs] = React.useState<Log[]>([]);

  React.useEffect(() => {
    dispatch(retrieveLogsActuactors(customer)).then((data) => {
      setLogs(data.payload);
    });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Actuador</TableCell>
            <TableCell>Option</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.length > 0 &&
            logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.actuactor}</TableCell>
                <TableCell>{log.option}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogsActuactors;
