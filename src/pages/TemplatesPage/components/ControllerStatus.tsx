import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";
import { useNotification } from "@app/services/notificationService";
import { retrieveControllers } from "@app/store/slices/controllerSlice";
import { Box, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ControllerStatus = () => {
  const dispatch = useAppDispatch();
  const { error } = useNotification();
  const { controllers } = useAppSelector((state) => state.controller);
  let [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer");

  const initFetch = useCallback(() => {
    dispatch(retrieveControllers());
  }, [dispatch]);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const customerControllers = controllers.filter(
    (controller) => controller.customer._id === customerId
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="row" // Alineación vertical en columna
      className="tw-gap-5"
    >
      {customerControllers &&
        customerControllers.map((customerController) => (
          <Box
            key={customerController._id}
            display="flex"
            alignItems="center"
            marginBottom={2} // Espacio entre elementos si es necesario
            className="tw-gap-2 tw-content-center"
          >
            <Typography variant="body2"> {/* Utiliza variant="body2" */}
              {customerController.name}
            </Typography>
            <Box
              sx={{
                height: 10,
                width: 10,
                borderRadius: "50%",
                background: customerController.connected ? "green" : "red",
              }}
            />
          </Box>
        ))}
    </Box>
  );
};

export default ControllerStatus;
