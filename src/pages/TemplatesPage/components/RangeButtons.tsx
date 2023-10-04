import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { ranges } from "../utils";

function RangeButtons() {

  const [alignment, setAlignment] = React.useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Box>
      <ToggleButtonGroup value={alignment}
        color="primary"
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment">
        {
          ranges.map((value, idx) => (
            <ToggleButton value={value} key={idx} >{value}</ToggleButton>
          ))
        }
      </ToggleButtonGroup>
    </Box>
  )
}

export default RangeButtons
