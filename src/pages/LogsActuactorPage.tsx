import LogsActuactors from "@app/components/LogsActuactors";
import { useAppSelector } from "@app/hooks/reduxHooks";
import React from "react";

const LogsActuactorPage = () => {
  const user = useAppSelector((state) => state.user);
  const customer = user.user?.customer._id;

  return <LogsActuactors customer={customer} />;
};

export default LogsActuactorPage;
