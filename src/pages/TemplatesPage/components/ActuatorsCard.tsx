import { useAppDispatch, useAppSelector } from "@app/hooks/reduxHooks";

import { doCreateLogsActuactors } from "@app/store/slices/logsActuactorSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ActuatorsCardProps {
  name: string;
  virtualPin: number;
  states: any;
  handleOutput: (vp?: number, msg?: string, customer?: string) => void;
}

interface ClickEventLog {
  actuactor: string; // Nombre del actuador
  user: string; // Nombre de usuario o identificador
  option: string; // Opción seleccionada
  customer: string | null; // Marca de tiempo del evento
}

const ActuatorsCard: React.FC<ActuatorsCardProps> = ({
  name,
  virtualPin,
  states,
  handleOutput,
}) => {
  // const [selectedOption, setSelectedOption] = useState<string | undefined>('  ')
  const dispatch = useAppDispatch();
  let [searchParams] = useSearchParams();
  const customer = searchParams.get("customer");
  const [buttonColor, setButtonColor] = useState<string>("gray");
  const [stateColor, setStateColor] = useState<string>("gray");
  const [_actualState, setActualState] = useState({ state: 0, operation: 0 });
  const [_loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const user = useAppSelector((state) => state.user);
  const userRole = user ? user.user?.roles : [{ name: "USER_ROLE" }];

  const isViewer = userRole?.map((rol) => rol.name).includes("MODERATOR_ROLE");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCreateLog = (log: ClickEventLog) => {
    dispatch(doCreateLogsActuactors(log));
  };

  const handleOptionClick = (option: string) => {
    const clickEvent: ClickEventLog = {
      actuactor: name, // Nombre del actuador
      option: option,
      user: user.user?.firstName || "Unknown", // Nombre de usuario (o "Unknown" si no está definido)
      customer: customer, // Marca de tiempo actual
    };

    onCreateLog(clickEvent);

    let optionCode = "0";
    switch (option) {
      case "Off":
        optionCode = "0";
        break;
      case "On":
        optionCode = "1";
        break;
      case "Auto":
        optionCode = "2";
        break;

      default:
        break;
    }

    handleOutput(virtualPin, optionCode);

    setSelectedOption(option);
    handleClose();
  };

  useEffect(() => {
    if (states[virtualPin as number] === undefined) return;
    const aState = states[virtualPin as number].split(",");
    setActualState({ state: aState[0], operation: aState[1] });

    switch (aState[0]) {
      case "0":
        setButtonColor("#b31414");
        break;
      case "1":
        if (aState[1] === "1") {
          setButtonColor("orange");
        } else {
          setButtonColor("green");
        }
        break;
      default:
        setButtonColor("gray");
        break;
    }

    switch (aState[1]) {
      case "0":
        setStateColor("#b31414");
        setSelectedOption("Off");
        setLoading(false);
        break;
      case "1":
        setStateColor("orange");
        setSelectedOption("On");
        setLoading(false);
        break;
      case "2":
        setStateColor("green");
        setSelectedOption("Auto");
        setLoading(false);
        break;
      default:
        setStateColor("gray");
        break;
    }
  }, [states]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={2}>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent sx={{ textAlign: "center", position: "relative" }}>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Box
              sx={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: buttonColor,
                marginRight: "5px",
              }}
            />
            <Button
              component="button"
              aria-controls="menu"
              aria-haspopup="true"
              onClick={!isViewer ? handleClick : undefined}
              variant="outlined"
              color="secondary"
              sx={{ backgroundColor: stateColor, color: "white" }}
              disabled={!selectedOption}
            >
              {selectedOption ? selectedOption : <CircularProgress size={20} />}
            </Button>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => handleOptionClick("On")}
                selected={selectedOption === "On"}
              >
                On
              </MenuItem>
              <MenuItem
                onClick={() => handleOptionClick("Off")}
                selected={selectedOption === "Off"}
              >
                Off
              </MenuItem>
              <MenuItem
                onClick={() => handleOptionClick("Auto")}
                selected={selectedOption === "Auto"}
              >
                Auto
              </MenuItem>
            </Menu>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ActuatorsCard;
