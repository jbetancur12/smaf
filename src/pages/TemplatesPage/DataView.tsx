import { getTemplate } from '@app/api/template.api'
import { Sensor, VariableData } from '@app/api/variable.api'
import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import RangeButtons from './components/RangeButtons'

const DataView = () => {
  let [searchParams] = useSearchParams()

  const [variables, setVariables] = useState<VariableData[]>([])
  const [ai, setAi] = useState<Sensor[]>([])

  const templateId = searchParams.get('template')
  const customerId = searchParams.get('customer')

  useEffect(() => {


    getTemplate(templateId).then((data) => {
      setVariables(data.variables)
      const analogInputs = data.variables.filter(
        (obj) => obj.typePin === 'analogInput'
        )
        setAi(analogInputs as Sensor[])
      })

      return () => {}
    }, [])


  return (
    <Box m="1.5rem 2.5rem">
      <RangeButtons/>
    </Box>

  )
}

export default DataView
