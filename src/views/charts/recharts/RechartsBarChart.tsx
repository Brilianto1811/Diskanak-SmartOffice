// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { GetStatistikKeg, GetStatistikTask } from 'src/store/module-pegawai'

interface Props {
  direction: 'ltr' | 'rtl'
}

const CustomTooltip = (data: TooltipProps<any, any>) => {
  const { active, payload } = data

  if (active && payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography>{data.label}</Typography>
        <Divider />
        {data &&
          data.payload &&
          data.payload.map((i: any) => {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: i.fill, mr: 2.5 } }} key={i.dataKey}>
                <Icon icon='mdi:circle' fontSize='0.6rem' />
                <Typography variant='body2'>{`${i.dataKey} : ${i.payload[i.dataKey]}`}</Typography>
              </Box>
            )
          })}
      </div>
    )
  }

  return null
}

const RechartsBarChart = ({ direction }: Props) => {
  const [dataTask, setDataTask] = useState<any>([])
  const [dataKeg, setDataKeg] = useState<any>([])

  const getDataStatistik = async () => {
    try {
        const responseDataTask = await GetStatistikTask();
        const responseDataKeg = await GetStatistikKeg();

        if (responseDataTask && responseDataTask.data) {
            setDataTask(
                responseDataTask.data.map(val => {
                    return {
                        name: val.comt_bidang,
                        orang: val.jumlah_orang
                    }
                })
            );
        } else {
            console.error("Error: Response data from GetStatistikTask is invalid.");
        }

        if (responseDataKeg && responseDataKeg.data) {
            setDataKeg(
                responseDataKeg.data.map(val => {
                    return {
                        name: val.comt_bidang,
                        orang: val.jumlah_orang
                    }
                })
            );
        } else {
            console.error("Error: Response data from GetStatistikKeg is invalid.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


  useEffect(() => {
    getDataStatistik()
  }, [])

  return (
    <>
      <Card>
        <Typography sx={{ mb: 1.5, textAlign: 'center', color: 'black', fontSize: '20px', marginTop: '5px' }}>
          Statistik Kegiatan Pegawai Per Bidang
        </Typography>
        <CardContent>
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer>
              <BarChart height={350} data={dataKeg} barSize={15} style={{ direction }} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' reversed={direction === 'rtl'} />
                <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey='orang' stackId='a' fill='#826af9' />
                {/* <Bar dataKey='Pegawai' stackId='a' fill='#d2b0ff' /> */}
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Typography sx={{ mb: 1.5, textAlign: 'center', color: 'black', fontSize: '20px', marginTop: '5px' }}>
            Statistik Penugasan Pegawai Per Bidang
          </Typography>
          <Box sx={{ height: 350, marginTop: '50px' }}>
            <ResponsiveContainer>
              <BarChart height={350} data={dataTask} barSize={15} style={{ direction }} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' reversed={direction === 'rtl'} />
                <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey='orang' stackId='a' fill='#826af9' />
                {/* <Bar dataKey='Pegawai' stackId='a' fill='#d2b0ff' /> */}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default RechartsBarChart
