import { getTemplate, getTemplateMeasurements } from '@app/api/template.api'
import { Sensor, VariableData } from '@app/api/variable.api'
import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import DatePickerRange from './components/DatePickerRange'
import RangeButtons from './components/RangeButtons'
import SelectComponent from './components/SelectComponent'

interface ISeries {
  timestamp: string
  measurements: {}
}

const dt: Date = new Date()
dt.setHours(dt.getHours() - 6)

const DataView = () => {
  let [searchParams] = useSearchParams()

  const [startDate, setStartDate] = useState<Date>(dt)
  const [endDate, setEndDate] = useState<Date>(new Date())

  const [variables, setVariables] = useState<VariableData[]>([])
  const [ai, setAi] = useState<Sensor[]>([])
  const [graphData, setGraphData] = useState({
    salesGraph: [],
    salesByPeriod: []
  });
  const [unit, setUnit] = useState('hour');
  const [data, setData] = useState<ISeries[]>([])
  console.log("🚀 ~ file: DataView.tsx:33 ~ DataView ~ data:", data)
  const [custom, setCustom] = useState<Boolean>(false)
  const [variablesQuery, setVariablesQuery] = useState<string | string[]>([])

  const templateId = searchParams.get('template')
  const customerId = searchParams.get('customer')

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
      }
    )
  }

  const handleFormSubmit = (selectedOptions: string[]) => {
    // setVariablesQuery(selectedOptions)
    // Aquí puedes realizar la llamada a la API y enviar las selecciones
    const queryString = selectedOptions.join(',')

    fetchData(startDate, endDate, templateId, queryString)
  }

  useEffect(() => {
    getTemplate(templateId).then((data) => {
      setVariables(data.variables)
      const analogInputs = data.variables.filter(
        (obj) => obj.typePin === 'analogInput'
      )
      setAi(analogInputs as Sensor[])
    })

    return () => { }
  }, [])


  return (
    <Box m="1.5rem 2.5rem">
      <Box className="tw-flex tw-items-center tw-gap-3 tw-mb-4" >
        <RangeButtons custom={setCustom} datesQuery={datesQuery} disable={variablesQuery.length <= 0}/>
       {custom && <DatePickerRange setGraphData={setGraphData} setUnit={setUnit}  datesQuery={datesQuery} custom={custom}/>}
      </Box>
      <Box className="tw-w-full">
        <SelectComponent options={ai} onSubmit={handleFormSubmit} setVariablesQuery={setVariablesQuery}/>
      </Box>
    </Box>
  )
}

export default DataView
