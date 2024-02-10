import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useState } from "react";
import { ranges, ranges_ } from "../utils";

interface RangeButtonsProps {
  custom: (custom: Boolean) => void;
  datesQuery: (start: Date, end: Date) => void;
  disable: boolean;
  setRange: (range: string | null) => void;
}

interface rangesProps {
  lastHour: string;
  "6Hours": string;
  "1Day": string;
  "1Week": string;
  "1Month": string;
  custom: string;
}

const _dt: Date = new Date();
_dt.setHours(_dt.getHours() - 24);

const RangeButtons: React.FC<RangeButtonsProps> = ({
  custom,
  datesQuery,
  disable,
  setRange,
}) => {
  const [alignment, setAlignment] = React.useState<string | null>("6Hours");
  const [_startDate, setStartDate] = useState<Date>(new Date(_dt));
  const [endDate, _setEndDate] = useState<Date>(new Date());

  const handleAlignment = (
    _event: React.MouseEvent<HTMLElement>,
    range: string | null
  ) => {
    setAlignment(range);
    custom(false);
    setRange(range);
    const dt: Date = new Date();

    switch (range) {
      case "lastHour":
        dt.setHours(dt.getHours() - 1);
        break;
      case "6Hours":
        dt.setHours(dt.getHours() - 6);
        break;
      case "1Day":
        dt.setHours(dt.getHours() - 24);
        break;
      case "1Week":
        dt.setHours(dt.getHours() - 168);
        break;
      case "1Month":
        dt.setHours(dt.getHours() - 730);
        break;
      case "3Months":
        dt.setHours(dt.getHours() - 2190);
        break;
      case "custom":
        custom(true);
        dt.setHours(dt.getHours() - 6);
        break;

      default:
        break;
    }

    setStartDate(new Date(dt));
    datesQuery(new Date(dt), endDate);
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={alignment}
        color="secondary"
        exclusive
        disabled={disable}
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        {ranges.map((value, idx) => (
          <ToggleButton value={value} key={idx}>
            {ranges_[value as keyof rangesProps]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default RangeButtons;
