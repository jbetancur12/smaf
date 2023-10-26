import { httpApi } from "@app/api/http.api";
import { VariableDataResponse } from "@app/api/variable.api";
import { useNotification } from "@app/services/notificationService";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import React from "react";


interface ExcelUploadButtonProps {
  setVariables: React.Dispatch<React.SetStateAction<VariableDataResponse[]>>;
}

const ExcelUploadButton: React.FC<ExcelUploadButtonProps> = ({setVariables}) => {

  const {success, error} = useNotification()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleSubmit(selectedFile);
    }
  };

  const handleSubmit = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    httpApi
      .post("api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
       setVariables((current) => [...current, ...response.data.data])
       success("Archivo cargado con éxito");
      })
      .catch((e) => {
        console.log(e)
        error("Error al cargar el archivo");
      });
  };

  return (
    <div>
      <label>
        <input
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          color="secondary"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Subir Excel
        </Button>
      </label>
    </div>
  );
};

export default ExcelUploadButton;
