import { Button } from '@mui/material';
import React, { forwardRef, useState } from 'react';
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function manipulateDate(oldDate: Date, offset: number, offsetType: string, operation: string): Date {
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
        operators[operation]((oldDate as any)[`get${offsetTypes[offsetType]}`](), offset)
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

function hoursBetween(date1: Date, date2: Date): number {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  return diffHours;
}

function getDaysBetweenDates(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(date2);
  d2.setHours(23, 59, 59, 999);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

function getUnit(days: number): string {
  let timeUnit: string;

  switch (true) {
    case days <= 1:
      timeUnit = "hour";
      break;
    case days <= 30:
      timeUnit = "day";
      break;
    case days <= 365:
      timeUnit = "month";
      break;
    default:
      timeUnit = "year";
      break;
  }

  return timeUnit;
}

function getDateISOString(date: Date | null, endOfDay: boolean = false): string | null {
  const hours = endOfDay ? 23 : 0;
  const minutes = endOfDay ? 59 : 0;
  const seconds = endOfDay ? 59 : 0;
  const milliseconds = endOfDay ? 999 : 0;
  return date ? new Date(date.setHours(hours, minutes, seconds, milliseconds)).toISOString() : null;
}

const DatePickerRange: React.FC<{
  setGraphData: (data: any) => void;
  setUnit: (unit: string) => void;
  datesQuery: (start: Date, end: Date) => void
  custom: Boolean
}> = ({ setGraphData, setUnit,  datesQuery, custom }) => {
  const [startDate, setStartDate] = useState<Date>(manipulateDate(new Date(), 7, "D", "rest"));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const diffDays = getDaysBetweenDates(endDate, startDate);
  const params = {
    endDate: getDateISOString(endDate, true),
    startDate: getDateISOString(startDate),
    unit: getUnit(diffDays),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // Assuming you have a `useGetDashboardGraphQuery` hook defined elsewhere
  // const { data, isLoading } = useGetDashboardGraphQuery(params);

  // setGraphData(data);
  // setUnit(getUnit(diffDays));
  if(custom){
    datesQuery(startDate, endDate)
  }

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    datesQuery(start, end)
  };

  const ExampleCustomInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <Button variant='contained' className="example-custom-input" onClick={onClick} ref={ref as React.Ref<HTMLButtonElement>}>
        {value}
      </Button>
    )
  );

  const MyContainer: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => {
    return (
      <div>
        <CalendarContainer className={className}>
          <div style={{ display: 'flex' }}>
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
}

export default DatePickerRange;
