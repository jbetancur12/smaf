import { getTemplateMeasurements } from '@app/api/template.api'
import { Sensor, VariableData } from '@app/api/variable.api'
import { useNotification } from '@app/services/notificationService'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Backdrop, Box, CircularProgress, IconButton } from "@mui/material"
import { useState } from "react"
import ApexCharts from './components/ApexCharts'
import DatePickerRange from './components/DatePickerRange'
import RangeButtons from './components/RangeButtons'
import SelectComponent from './components/SelectComponent'
import Sensors from './components/Sensors'

interface ISeries {
  timestamp: string
  measurements: {}
}

interface DataViewProps {
  ai: Sensor[];
  templateId: string | null;
  variables: VariableData[]
  mqtt: any
}

const dt: Date = new Date()
dt.setHours(dt.getHours() - 6)

const DataView: React.FC<DataViewProps> = ({ ai, templateId, variables, mqtt }) => {

  const {error} = useNotification()

  const [startDate, setStartDate] = useState<Date>(dt)
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [data, setData] = useState<ISeries[]>([])
  const [custom, setCustom] = useState<Boolean>(false)
  const [variablesQuery, setVariablesQuery] = useState<string[]>([])
  const [backdrop, setBackdrop] = useState(false)
  const [range, setRange] = useState<string | null>("")


  const datesQuery = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  const fetchData = (
    startDate: Date,
    endDate: Date,
    templateId: string | null,
    queryString: string
  ) => {
    setBackdrop(true)
    getTemplateMeasurements(startDate, endDate, templateId, queryString).then(
      ({ data }) => {
        setData(data)
        setBackdrop(false)
      }
    )
  }

  const handleFormSubmit = (selectedOptions: string[]) => {
    // setVariablesQuery(selectedOptions)
    // Aquí puedes realizar la llamada a la API y enviar las selecciones
    const queryString = selectedOptions.join(',')

    fetchData(startDate, endDate, templateId, queryString)
  }

  const backwardDate = () => {
    const queryString = variablesQuery.join(',')
    let hoursToSubtract = 1;

    switch (range) {
      case 'lastHour':
        hoursToSubtract = 1;
        break
      case '6Hours':
        hoursToSubtract = 6;
        break
      case '1Day':
        hoursToSubtract = 24;
      break
      case '1Week':
        hoursToSubtract = 168;
        break
      case '1Month':
        hoursToSubtract = 730;
        break

      default:
        break
    }

    const newStartDate = new Date(startDate);
    newStartDate.setHours(startDate.getHours() - hoursToSubtract);
    setStartDate(newStartDate);

    const newEndDate = new Date(endDate);
    newEndDate.setHours(endDate.getHours() - hoursToSubtract);
    setEndDate(newEndDate);

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    fetchData(newStartDate, newEndDate, templateId, queryString);
  }


  const forwardDate = () => {
    const queryString = variablesQuery.join(',')
    let hoursToSubtract = 1;

    switch (range) {
      case 'lastHour':
        hoursToSubtract = 1;
        break
      case '6Hours':
        hoursToSubtract = 6;
        break
      case '1Day':
        hoursToSubtract = 24;
      break
      case '1Week':
        hoursToSubtract = 168;
        break
      case '1Month':
        hoursToSubtract = 730;
        break

      default:
        break
    }

    const newStartDate = new Date(startDate);
    newStartDate.setHours(startDate.getHours() + hoursToSubtract);
    setStartDate(newStartDate);

    const newEndDate = new Date(endDate);
    newEndDate.setHours(endDate.getHours() + hoursToSubtract);
    setEndDate(newEndDate);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    if(newEndDate > (new Date())){
      error("La fecha y hora final no puede ser mayor que la hora y fecha actual")
      return
    }
    fetchData(newStartDate, newEndDate, templateId, queryString);
  }


  return (
    <Box m="1.5rem 2.5rem">
      <Box className="tw-flex tw-items-center tw-gap-3 tw-mb-4" >
        <RangeButtons custom={setCustom} datesQuery={datesQuery} disable={variablesQuery.length <= 0} setRange={setRange}/>
        {custom && <DatePickerRange datesQuery={datesQuery} custom={custom} />}
      </Box>
      <Box className="tw-w-full">
        <SelectComponent options={ai} onSubmit={handleFormSubmit} setVariablesQuery={setVariablesQuery} />
      </Box>
      <Box>
        {data.length > 0 && <ApexCharts data={data} />}
        <Box className="tw-flex tw-justify-center tw-gap-5">
          <IconButton>
            <ArrowBack onClick={backwardDate}/>
          </IconButton>
          <IconButton>
            <ArrowForward onClick={forwardDate}/>
          </IconButton>
        </Box>
      </Box>
      <Sensors variables={variables} data={mqtt} />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default DataView
