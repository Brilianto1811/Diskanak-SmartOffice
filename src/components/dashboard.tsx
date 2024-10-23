import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import RechartsBarChart from 'src/views/charts/recharts/RechartsBarChart'
import { useSettings } from 'src/@core/hooks/useSettings'

const Dashboard = () => {
  const { settings } = useSettings()

  return (
    <ApexChartWrapper>
      <DatePickerWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <RechartsBarChart direction={settings.direction} />
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </ApexChartWrapper>
  )
}

export default Dashboard
