import { getTemplateMeasurements } from '@app/api/template.api'
import { Sensor, VariableData } from '@app/api/variable.api'
import { Backdrop, Box, CircularProgress } from "@mui/material"
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

interface DataViewProps{
  ai: Sensor[];
  templateId: string | null;
  variables: VariableData[]
  mqtt: any
}

const dt: Date = new Date()
dt.setHours(dt.getHours() - 6)

const DataView: React.FC<DataViewProps> = ({ai, templateId, variables,mqtt}) => {

  const [startDate, setStartDate] = useState<Date>(dt)
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [data, setData] = useState<ISeries[]>([])
  const [custom, setCustom] = useState<Boolean>(false)
  const [variablesQuery, setVariablesQuery] = useState<string | string[]>([])
  const [backdrop, setBackdrop] = useState(false)


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
    setBackdrop(true)

    fetchData(startDate, endDate, templateId, queryString)
  }


  return (
    <Box m="1.5rem 2.5rem">
      <Box className="tw-flex tw-items-center tw-gap-3 tw-mb-4" >
        <RangeButtons custom={setCustom} datesQuery={datesQuery} disable={variablesQuery.length <= 0}/>
       {custom && <DatePickerRange datesQuery={datesQuery} custom={custom}/>}
      </Box>
      <Box className="tw-w-full">
        <SelectComponent options={ai} onSubmit={handleFormSubmit} setVariablesQuery={setVariablesQuery}/>
      </Box>
      <Box>
      {data.length > 0  && <ApexCharts data={data}/>}
      </Box>
      <Sensors variables={variables} data={mqtt}/>
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
