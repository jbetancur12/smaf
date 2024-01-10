import { retrieveControllerTypes } from "@app/store/slices/controllerTypeSlice";
// import { Settings } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";
// import Program from "./components/Program";
import SettingsComponent from "./components/SettingsComponent";

const ControllerTypesPage = () => {
  const dispatch = useDispatch();
  // const theme = useTheme()

  // const { controllerTypeId } = useParams();
  // const [isProgramDialogOpen, setProgramDialogOpen] = useState(false);

  // const [programClicked, setProgramClicked] = useState("")
  // const [, setProgramClicked] = useState("");

  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState(false);

  useEffect(() => {
    //@ts-ignore
    dispatch(retrieveControllerTypes());
  }, []);

  // Textos de los botones
  const buttonLabels = [
    "SAL1",
    "SAL2",
    "SAL3",
    "SAL4",
    "SAL5",
    "SAL6",
    "SAL7",
    "SAL8",
    "SAL9",
    "SAL10",
    "SAL11",
    "SAL12",
    "SAL13",
    "SAL14",
    "SAL15",
    "SAL16",
    "SAL17",
    "SAL18",
    "SAL19",
    "SAL20",
    "SAL21",
    "SAL22",
    "SAL23",
    "SAL24",
    "Tq 1",
    "Tq 2",
    "Tq 3",
    "Tq 4",
    "Tq 5",
    "Tq 6",
    "Tq 7",
    "Tq 8",
    "VM1",
    "VM2",
    "VM3",
    "VM4",
    "B1",
    "B2",
    "JET",
    "AGI T",
  ];

  // const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Divide los botones en grupos de 8
  const buttonGroups = [];
  for (let i = 0; i < buttonLabels.length; i += 8) {
    const buttonGroup = buttonLabels.slice(i, i + 8);
    buttonGroups.push(buttonGroup);
  }

  // const handleProgramDialogOpen = (program: string) => {
  //   setProgramDialogOpen(true);
  //   setProgramClicked(program)
  // };

  // const handleProgramDialogClose = () => {
  //   setProgramDialogOpen(false);
  // };

  // const handleSettingsDialogOpen = () => {
  //   setSettingsDialogOpen(true);
  // }

  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
  };

  return (
    <>
      {/* <Container maxWidth="sm">  */}
      {/* <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" justifyContent="center">
            {letras.map((letra, index) => (
              <Button key={index} variant="contained" color="primary"
                onClick={() => handleProgramDialogOpen(letra)}
                sx={{
                  marginBottom: "20px",
                  marginRight: "10px",
                  width: "100px" // Ancho fijo para todos los botones
                }}>
                Programa {letra}
              </Button>
            ))}
            <Button
              sx={{
                marginBottom: "20px",
                marginRight: "10px",
                width: "100px" // Ancho fijo para todos los botones
              }}
              variant="contained"
              color="primary"
              startIcon={<Settings />}
              onClick={handleSettingsDialogOpen}
            />
          </Box>


        </Box> */}

      {/* </Container> */}
      {/* {isProgramDialogOpen && <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta la opacidad aquí (0.5 es 50% de opacidad)
        zIndex: 9995, // Coloca el fondo detrás del modal
      }}>
        <Box id="page" sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9996,

          // background: 'white',
          //
          display: isProgramDialogOpen ? 'flex' : 'none',
          flexDirection: "column",
          alignItems: "center",
          width: "100%",

        }}

        >

          <Typography variant="h5">Este es un modal personalizado</Typography>



        </Box>
      </Box>} */}
      <Box maxWidth={800} margin="0 auto">
        {/* <Program handleProgramDialogClose={handleProgramDialogClose} /> */}
      </Box>

      {isSettingsDialogOpen && (
        <SettingsComponent
          isSettingsDialogOpen={isSettingsDialogOpen}
          handleSettingsDialogClose={handleSettingsDialogClose}
        />
      )}
    </>
  );
};

export default ControllerTypesPage;
