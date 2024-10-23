import React, { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
  Collapse,
  CardMedia,
  IconButton,
  CardHeader,
  CardActions,
  Skeleton
} from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { GetDataKeg } from 'src/store/module-rutinitas'
import Icon from 'src/@core/components/icon'
import { baseURL } from 'src/utils/api'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'

const GalleryKegiatan = () => {
  const [collapseStates, setCollapseStates] = useState<{ [taskId: string]: boolean }>({})

  const [data, setData] = useState<any>()
  const selectedDate = useRef<Dayjs | null>(new AdapterDayjs().date())
  const [loading, setLoading] = useState<boolean>(false)
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  console.log(dataLoaded)

  const handleClick = (taskId: string) => {
    setCollapseStates(prevStates => ({
      ...prevStates,
      [taskId]: !prevStates[taskId]
    }))
  }

  useEffect(() => {
    GetDataGallery(selectedDate.current)
  }, [])

  const GetDataGallery = async (selectedDate: any) => {
    try {
      const responseData = await GetDataKeg(selectedDate ? selectedDate.format('YYYY-MM-DD') : '')
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({
          ...val,
          tgl_data: val.tgl_data
        }))
        setData(tmpData)
      } else {
        setData(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchData = async (getDataFunction: () => Promise<void>) => {
    try {
      // Execute the data retrieval function
      await getDataFunction()
    } catch (error) {
      // Handle the error (e.g., log it, show an error message)
      console.error('Error fetching data:', error)
    } finally {
      // Set loading to false after a delay of 3 seconds
      setTimeout(() => {
        setLoading(false)
        setDataLoaded(true)
      }, 700)
    }
  }

  const handleDateChange = async (date: Dayjs | null) => {
    setLoading(true) // Set loading to true when starting to fetch data
    selectedDate.current = date
    await fetchData(() => GetDataGallery(date)) // Pass GetDataGallery function to fetchData
  }

  return (
    <>
      <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
        <CardHeader
          title={
            <>
              <span style={{ color: 'black' }}>Gallery Kegiatan Pegawai</span> <br />
              <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>
                Gallery seluruh Kegiatan/Rutinitas Pegawai.
              </span>
            </>
          }
          style={{ backgroundColor: '#AFE1AF', textAlign: 'center', borderRadius: '8px' }}
        />
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
          <DatePicker
            label='Pilih Tanggal'
            value={selectedDate.current}
            onChange={date => handleDateChange(date as Dayjs | null)}
            format='YYYY-MM-DD'
          />
        </div>
      </LocalizationProvider>
      {loading ? (
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <Skeleton variant='rectangular' height={200} />
                <CardContent>
                  <Skeleton variant='text' height={20} />
                  <Skeleton variant='text' height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card style={{ marginTop: '5px', marginLeft: '3px', padding: '25px' }}>
          <Grid container spacing={2}>
            {data ? (
              data.map((task: any) => (
                <Grid item key={task.id} xs={12} sm={6} md={4} lg={3}>
                  <Card>
                    <CardMedia
                      sx={{ height: '14.5625rem', objectFit: 'cover' }}
                      image={
                        task.str_file && task.str_file.length > 0
                          ? `${baseURL}/detailkeg/:?file=` + task.str_file
                          : '/images/diskominfo/user2.png'
                      }
                    />

                    <CardActions className='card-action-dense'>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Button onClick={() => handleClick(task.id_offkeg)}>Details</Button>
                        <IconButton size='small' onClick={() => handleClick(task.id_offkeg)}>
                          <Icon
                            fontSize='1.875rem'
                            icon={collapseStates[task.id_offkeg] ? 'tabler:chevron-up' : 'tabler:chevron-down'}
                          />
                        </IconButton>
                      </Box>
                    </CardActions>
                    <Collapse in={collapseStates[task.id_offkeg]}>
                      <Divider sx={{ m: '0 !important' }} />
                      <CardContent>
                        <Typography
                          variant='h5'
                          sx={{
                            textAlign: 'start',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1, // Menyesuaikan jumlah baris yang diizinkan sebelum elipsis
                            marginBottom: 0 // Menyesuaikan margin bawah
                          }}
                        >
                          {task.name_offpegawai}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'black',
                            fontWeight: 'bold'
                          }}
                        >
                          Bidang:
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{task.name_bidang}</Typography>
                        <Typography
                          sx={{
                            color: 'black',
                            fontWeight: 'bold'
                          }}
                        >
                          Tanggal:
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{task.tgl_offkeg}</Typography>
                        <Typography
                          sx={{
                            color: 'black',
                            fontWeight: 'bold'
                          }}
                        >
                          Waktu:
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          {task.jam_offkeg} - {task.jam_offkeg2}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'black',
                            fontWeight: 'bold'
                          }}
                        >
                          Kegiatan:
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{task.cap_offkeg}</Typography>
                        <Typography
                          sx={{
                            color: 'black',
                            fontWeight: 'bold'
                          }}
                        >
                          Keterangan:
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{task.note_offkeg}</Typography>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  borderRadius={2}
                  p={2}
                  textAlign='center'
                  minHeight='250px'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Box borderRadius={1}>
                    <Typography variant='h6' style={{ color: '#CCCCCC' }}>
                      Tidak ada Galeri
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Card>
      )}
    </>
  )
}

export default GalleryKegiatan
