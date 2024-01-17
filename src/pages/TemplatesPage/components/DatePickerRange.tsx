import { Button } from "@mui/material";
import React, { forwardRef, useState } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function manipulateDate(
  oldDate: Date,
  offset: number,
  offsetType: string,
  operation: string
): Date {
  const newDate = new Date(oldDate.getTime());

  const operators: Record<string, (val: number, off: number) => number> = {
    add: (val, off) => val + off,
    rest: (val, off) => val - off,
  };

  const offsetTypes: Record<string, string> = {
    Y: "FullYear",
    M: "Month",
    D: "Date",
    H: "Hours",
  };

  if (operation === "add" || operation === "rest") {
    (newDate as any)[`set${offsetTypes[offsetType]}`](
      operators[operation](
        (oldDate as any)[`get${offsetTypes[offsetType]}`](),
        offset
      )
    );
  } else {
    return oldDate;
  }

  return newDate;
}

// if (operation === "add" || operation === "rest") {
//   if (offsetTypeKey) {
//     (newDate as any)[`set${offsetTypeKey}`](
//       operators[operation]((newDate as any)[offsetTypeKey], offset)
//     );
//   } else {
//     return oldDate;
//   }
// } else {
//   return oldDate;
// }

const DatePickerRange: React.FC<{
  datesQuery: (start: Date, end: Date) => void;
  custom: Boolean;
}> = ({ datesQuery, custom }) => {
  const [startDate, setStartDate] = useState<Date>(
    manipulateDate(new Date(), 7, "D", "rest")
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Assuming you have a `useGetDashboardGraphQuery` hook defined elsewhere
  // const { data, isLoading } = useGetDashboardGraphQuery(params);

  // setGraphData(data);
  // setUnit(getUnit(diffDays));
  if (custom) {
    datesQuery(startDate, endDate);
  }

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    setStartDate(start);
    setEndDate(end);
    datesQuery(start, end);
  };

  const ExampleCustomInput = forwardRef<
    HTMLInputElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <Button
      variant="contained"
      className="example-custom-input"
      onClick={onClick}
      ref={ref as React.Ref<HTMLButtonElement>}
    >
      {value}
    </Button>
  ));

  const MyContainer: React.FC<{
    className: string;
    children: React.ReactNode;
  }> = ({ className, children }) => {
    return (
      <div>
        <CalendarContainer className={className}>
          <div style={{ display: "flex" }}>
            <div style={{ position: "relative" }}>{children}</div>
          </div>
        </CalendarContainer>
      </div>
    );
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      monthsShown={2}
      calendarContainer={MyContainer}
      customInput={<ExampleCustomInput />}
    />
  );
};

export default DatePickerRange;
