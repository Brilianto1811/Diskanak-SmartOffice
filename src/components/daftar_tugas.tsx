import React, { SyntheticEvent, useEffect, useState, Fragment, useRef } from 'react'
import { Card, CardContent, Typography, Button, Grid, Box, CardHeader, Divider, CircularProgress } from '@mui/material'
import {
  GetTaskByIdPegawai,
  GetTaskByIdPegawai2,
  GetTaskByIdPegawai3,
  GetTaskByIdPegawai4,
  GetTaskTerima,
  UpdateLaporanTask
} from 'src/store/module-penugasan'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import usedecodetoken from 'src/utils/decodecookies'
import { baseURL } from 'src/utils/api'
import { Icon } from '@iconify/react'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from 'src/@core/layouts/types'
import { DataMdPenerimaTask } from 'src/models/data-md-penerimatask'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Input from '@mui/material/Input'
import { useDropzone } from 'react-dropzone'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

interface FileProp {
  name: string
  type: string
  size: number
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const CardDaftarTugas = () => {
  const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant='determinate' {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          {/* Menggunakan fungsi Math.round untuk membulatkan nilai progres */}
          <Typography variant='body2' color='text.secondary'>
            {Math.round(props.value)}%
          </Typography>
        </Box>
      </Box>
    )
  }

  const userStatusObj: UserStatusType = {
    '0': 'error', // Belum Diterima
    '1': 'warning', // Diterima
    '2': 'success' // Complete
  }

  const columns: GridColDef[] = [
    {
      field: 'code_assign',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Status',
      flex: 0.2,
      minWidth: 180,
      renderCell(params) {
        const row: DataMdPenerimaTask = params.row
        const color = userStatusObj[row.code_assign.toString()] // Convert code_assign to string and access the corresponding color from userStatusObj
        const statusTitle = {
          '0': 'BELUM DITERIMA',
          '1': 'DITERIMA',
          '2': 'SUDAH SELESAI'
        }[row.code_assign.toString()] // Map code_assign to the corresponding status title

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={statusTitle}
            color={color}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },

    {
      field: 'tgl_offtask',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Tanggal',
      flex: 0.2,
      minWidth: 120
    },
    {
      field: 'jam_offtask',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Jam',
      flex: 0.2,
      minWidth: 120
    },
    {
      field: 'cap_offtask',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Kegiatan',
      flex: 0.275,
      minWidth: 290
    },
    {
      field: 'note_offtask',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Keterangan',
      flex: 0.2,
      minWidth: 124
    },
    {
      field: 'str_file',
      align: 'center',
      headerAlign: 'center',
      headerName: 'File',
      flex: 0.2,
      minWidth: 110,
      renderCell(params) {
        const row: DataMdPenerimaTask = params.row
        const fileUrl = `${baseURL}/detailtask/:?file=${row.str_file}`

        return (
          <a href={fileUrl} target='_blank' rel='noopener noreferrer'>
            <Icon icon='flat-color-icons:file' style={{ fontSize: '45px' }} />
          </a>
        )
      }
    },
    {
      field: 'reply_note',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Laporan',
      flex: 0.2,
      minWidth: 250
    }
  ]

  const [data, setData] = useState<any>()
  const [data2, setData2] = useState<any>()
  const [data3, setData3] = useState<any>()
  const [data4, setData4] = useState<any>()
  const [value, setValue] = useState<string>('1')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [open, setOpen] = React.useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState<any>()
  const selectedDate2 = useRef<Dayjs | null>(new AdapterDayjs().date())

  const handleDateChange = async (date: Dayjs | null) => {
    setLoading(true) // Set loading to true when starting to fetch data
    selectedDate2.current = date
    await fetchData(() => getDaftarTugas(date))
    await fetchData(() => getDaftarTugas2(date))
    await fetchData(() => getDaftarTugas3(date))
    await fetchData(() => getDaftarTugas4(date))
  }

  const fetchData = async (getDataFunction: () => Promise<void>) => {
    try {
      // Execute the data retrieval function
      await getDataFunction()
    } finally {
      // Set loading to false after a delay of 3 seconds
      setTimeout(() => {
        setLoading(false)
        setDataLoaded(true)
      }, 700)
    }
  }

  const handleChange = async (event: SyntheticEvent, newValue: string) => {
    try {
      setLoading(true)
      setValue(newValue)
      setDataLoaded(false)

      switch (newValue) {
        case '1':
          await fetchData(() => getDaftarTugas(selectedDate2.current))
          break
        case '2':
          await fetchData(() => getDaftarTugas2(selectedDate2.current))
          break
        case '3':
          await fetchData(() => getDaftarTugas3(selectedDate2.current))
          break
        case '4':
          await fetchData(() => getDaftarTugas4(selectedDate2.current))
          break
        default:
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDaftarTugas(selectedDate2.current),
      getDaftarTugas2(selectedDate2.current),
      getDaftarTugas3(selectedDate2.current),
      getDaftarTugas4(selectedDate2.current)
  }, [selectedDate2.current])

  const getDaftarTugas = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetTaskByIdPegawai(
        decodedtoken?.id_offpegawai,
        '0',
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({
          ...val,
          id: val.tgl_data,
          id_userassign: val.id_userassign,
          code_assign: val.code_assign,
          id_offpegawai: val.id_offpegawai
        }))
        setLoading(true)
        setData(tmpData)
      } else {
        setData(null)
      }
    } catch (error) {
      console.error(error)
    } finally {
      // Set loading to false after a delay of 3 seconds
      setTimeout(() => {
        setLoading(false)
        setDataLoaded(true)
      }, 700)
    }
  }

  const getDaftarTugas2 = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetTaskByIdPegawai2(
        decodedtoken?.id_offpegawai,
        '1',
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({
          ...val,
          id: val.id_userassign,
          id_offpegawai: val.id_offpegawai,
          code_assign: val.code_assign
        }))
        setData2(tmpData)
      } else {
        setData2(null)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getDaftarTugas3 = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetTaskByIdPegawai3(
        decodedtoken?.id_offpegawai,
        '2',
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({
          ...val,
          id: val.id_userassign,
          id_offpegawai: val.id_offpegawai,
          code_assign: val.code_assign
        }))
        setData3(tmpData)
      } else {
        setData3(null)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getDaftarTugas4 = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetTaskByIdPegawai4(
        decodedtoken?.id_offpegawai,
        '',
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({
          ...val,
          id: val.id_penerimatask,
          id_offpegawai: val.id_offpegawai,
          code_assign: val.code_assign
        }))
        setData4(tmpData)
      } else {
        setData4(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const notifysuccess = (msg: any) => {
    toast.success(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const notifywarning = (msg: any) => {
    toast.warn(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const handleTerima = async (id_penerimatask: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append('id_penerimatask', id_penerimatask)
    try {
      const response = await GetTaskTerima(bodyFormData)
      getDaftarTugas(selectedDate2.current)
      notifysuccess(response.pesan)
    } catch (ex: any) {
      console.error(ex)
    }
  }

  const handleUpdate = async () => {
    if (!selectedData) return

    const id_penerimatask = selectedData?.id_penerimatask
    const { progres } = selectedData
    const { reply_note } = selectedData

    const bodyFormData = new FormData()

    bodyFormData.append('id_penerimatask', id_penerimatask)
    bodyFormData.append('progres', progres)
    bodyFormData.append('reply_note', reply_note)

    if (files.length > 0) {
      files.forEach(file => {
        bodyFormData.append(`str_file`, file)
      })
    }

    try {
      const response = await UpdateLaporanTask(bodyFormData)
      notifysuccess(response.pesan)
      getDaftarTugas2(selectedDate2.current)
      handleClose()
    } catch (ex: any) {
      // notifyerror(ex.response.data.pesan)
      // Handle the error
      // console.error(ex)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      '/*': ['.', '.']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      notifywarning('You can only upload 1 files & maximum size of 2 MB.')
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='fa6-regular:file-lines' width='50' height='50' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? (Math.round(file.size / 100) / 10000).toFixed(1) + ' MB'
              : (Math.round(file.size / 100) / 10).toFixed(1) + ' kb'}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        {/* <Icon icon='tabler:x' fontSize={20} /> */}
        <Icon icon='ph:x-circle-light' width='30' height='30' />
      </IconButton>
    </ListItem>
  ))

  return (
    <>
      <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
        <CardHeader
          title={
            <>
              <span style={{ color: 'black' }}>Daftar Tugas</span> <br />
              <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>Daftar Tugas dari Atasan.</span>
            </>
          }
          style={{ backgroundColor: '#FBDB65', textAlign: 'center', borderRadius: '8px' }}
        />
      </div>
      <Divider style={{ margin: '10px 0' }} />
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='customized tabs example'>
          <Tab value='1' label='Daftar Tugas' />
          <Tab value='2' label='Progress Tugas' />
          <Tab value='3' label='Tugas Selesai' />
          <Tab value='4' label='Database' />
          <div style={{ marginLeft: 'auto', marginRight: 0 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Pilih Bulan dan Tahun'
                value={selectedDate2.current}
                onChange={date => handleDateChange(date as Dayjs | null)}
                views={['year', 'month']}
                format='YYYY-MM'
              />
            </LocalizationProvider>
          </div>
        </TabList>
        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <CircularProgress color='success' />
            <p>Loading...</p>
          </div>
        )}
        <TabPanel value='1'>
          {dataLoaded ? (
            <Card style={{ marginTop: '5px', marginLeft: '-23px', padding: '20px', width: '104%' }}>
              <Grid container spacing={2}>
                {data ? (
                  data.map((task: any) => (
                    <Grid item key={task.id} xs={12} sm={6} md={4} lg={3}>
                      <Card
                        style={{
                          background:
                            task.code_assign === 0
                              ? '#C41E3A' // Merah
                              : task.code_assign === 1
                              ? '#fedc56' // Kuning
                              : task.code_assign === 2
                              ? '#00a86b' // Hijau
                              : 'transparent', // Warna default atau kosong
                          height: '380px'
                        }}
                      >
                        <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
                          <CardHeader
                            title={
                              <Typography
                                variant='h5'
                                sx={{
                                  textAlign: 'center',
                                  color: 'black',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 1, // Menyesuaikan jumlah baris yang diizinkan sebelum elipsis
                                  marginBottom: 0, // Menyesuaikan margin bawah
                                  fontWeight: 'bold'
                                }}
                              >
                                {task.cap_offtask}
                              </Typography>
                            }
                            style={{
                              backgroundColor: '#E2DFD2',
                              textAlign: 'center',
                              padding: '10px' // Menambahkan padding untuk meningkatkan tinggi CardHeader
                            }}
                          />
                        </div>
                        <CardContent style={{ padding: '25px' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Keterangan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.note_offtask}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Tanggal:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.tgl_offtask}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            File:
                            {task.str_file ? (
                              <a
                                href={`${baseURL}/detailtask/:?file=${task.str_file}`}
                                download={task.str_file}
                                style={{
                                  textDecoration: 'none',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Icon icon='flat-color-icons:file' color='black' width='50' height='50' />
                              </a>
                            ) : (
                              <span>-</span>
                            )}
                          </Typography>
                          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Ditugaskan:</Typography>
                          <Typography sx={{ color: 'white', marginTop: -2 }}>{task.user_assign}</Typography>
                        </CardContent>
                        <DialogActions style={{ justifyContent: 'center', marginTop: '20px' }}>
                          <Button
                            variant='contained'
                            color='success'
                            onClick={() => handleTerima(task.id_penerimatask)}
                            disabled={task.code_assign === 1 || task.code_assign === 2}
                          >
                            Terima
                          </Button>
                        </DialogActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box
                      borderRadius={2}
                      p={2}
                      textAlign='center'
                      width='100%'
                      minHeight='250px'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Box>
                        <Typography variant='h6' style={{ color: '#CCCCCC' }}>
                          Tidak ada Daftar Tugas
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          ) : null}
        </TabPanel>
        <TabPanel value='2'>
          {dataLoaded ? (
            <Card style={{ marginTop: '5px', marginLeft: '-23px', padding: '20px', width: '104%' }}>
              <Grid container spacing={2}>
                {data2 ? (
                  data2.map((task: any) => (
                    <Grid item key={task.id_penerimatask} xs={12} sm={6} md={4} lg={3}>
                      <Card
                        style={{
                          background:
                            task.code_assign === 0
                              ? '#ed2939' // Merah
                              : task.code_assign === 1
                              ? '#FFBF00' // Kuning
                              : task.code_assign === 2
                              ? '#00a86b' // Hijau
                              : 'transparent', // Warna default atau kosong
                          height: '450px'
                        }}
                      >
                        <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
                          <CardHeader
                            title={
                              <Typography
                                variant='h5'
                                sx={{
                                  textAlign: 'center',
                                  color: 'black',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 1, // Menyesuaikan jumlah baris yang diizinkan sebelum elipsis
                                  marginBottom: 0, // Menyesuaikan margin bawah
                                  fontWeight: 'bold'
                                }}
                              >
                                {task.cap_offtask}
                              </Typography>
                            }
                            style={{
                              backgroundColor: '#E2DFD2',
                              textAlign: 'center',
                              padding: '10px' // Menambahkan padding untuk meningkatkan tinggi CardHeader
                            }}
                          />
                        </div>
                        <CardContent style={{ padding: '25px' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Keterangan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.note_offtask}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Tanggal:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.tgl_offtask}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            File:
                            {task.str_file ? (
                              <a
                                href={`${baseURL}/detailtask/:?file=${task.str_file}`}
                                download={task.str_file}
                                style={{
                                  textDecoration: 'none',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Icon icon='flat-color-icons:file' color='black' width='50' height='50' />
                              </a>
                            ) : (
                              <span>-</span>
                            )}
                          </Typography>
                          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Ditugaskan:</Typography>
                          <Typography sx={{ color: 'white', marginTop: -2 }}>{task.user_assign}</Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Komen Atasan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.reply_state ? task.reply_state : '-'}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Catatan Bawahan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.reply_note ? task.reply_note : '-'}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Progress:
                          </Typography>
                          <Typography>
                            <LinearProgressWithLabel value={task.progres || 0} />
                          </Typography>
                        </CardContent>
                        <DialogActions style={{ justifyContent: 'center', marginTop: '5px' }}>
                          <Button
                            variant='contained'
                            color='success'
                            onClick={() => {
                              setOpen(true)
                              setSelectedData(task)
                              console.log('ini edit', task)
                            }}
                            disabled={task.code_assign === 2}
                          >
                            Laporan
                          </Button>
                        </DialogActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box
                      borderRadius={2}
                      p={2}
                      textAlign='center'
                      width='100%'
                      minHeight='250px'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Box borderRadius={1}>
                        <Typography variant='h6' style={{ color: '#CCCCCC' }}>
                          Tidak ada Progress Tugas
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle
                  style={{ textAlign: 'center', backgroundColor: '#50C878', marginTop: '-15px', fontSize: '20px' }}
                >
                  Laporan Progress
                </DialogTitle>
                <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
                <DialogContent>
                  {/* {selectedData && (
                    <> */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      marginTop: '-15px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}
                    >
                      <Typography variant='body1' style={{ marginRight: '21px' }}>
                        Laporan Hasil:
                      </Typography>
                      <Input
                        title='Masukkan Laporan Hasil Anda'
                        placeholder='Masukkan Laporan Hasil Anda'
                        fullWidth
                        value={selectedData?.reply_note}
                        onChange={e => setSelectedData({ ...selectedData, reply_note: e.target.value })}
                        style={{
                          width: '530px',
                          marginTop: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '8px'
                        }}
                        multiline={true}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}
                    >
                      <Typography variant='body1' style={{ marginRight: '21px' }}>
                        Progres
                      </Typography>
                      <Input
                        title='Masukkan Persentase Progress (0-100)'
                        placeholder='Masukkan Persentase Progress (0-100)'
                        fullWidth
                        type='number'
                        disabled={true}
                        value={selectedData?.progres}
                        onChange={e => setSelectedData({ ...selectedData, progres: e.target.value })}
                        style={{
                          width: '530px',
                          marginTop: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '8px'
                        }}
                        multiline={false}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <button
                          onClick={() =>
                            setSelectedData({ ...selectedData, progres: Math.max(selectedData.progres - 10, 0) })
                          }
                          style={{ marginRight: '10px' }}
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            setSelectedData({ ...selectedData, progres: Math.min(selectedData.progres + 10, 100) })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}
                    >
                      <Typography variant='body1' style={{ marginRight: '21px' }}>
                        Upload File:
                      </Typography>
                    </div>
                  </div>
                  <Fragment>
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input
                        value={selectedData?.namaFileFoto}
                        onChange={e => setSelectedData({ ...selectedData, namaFileFoto: e.target.value })}
                        {...getInputProps()}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          textAlign: 'center',
                          alignItems: 'center',
                          width: '530px',
                          flexDirection: 'column',
                          paddingTop: '20px',
                          paddingBottom: '20px',
                          borderRadius: '10px',
                          border: '2px dashed rgba(0, 0, 0, 0.29)'
                        }}
                      >
                        <Box
                          sx={{
                            mb: 8.75,
                            width: 48,
                            height: 48,
                            display: 'flex',
                            borderRadius: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                          }}
                        >
                          <Icon icon='tabler:upload' fontSize='1.75rem' />
                        </Box>
                        <Typography variant='h4' sx={{ mb: 2.5 }}>
                          Drop files here or click to upload.
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>*.docx, *.xlsx, *.pdf, *pptx. dll</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Max 1 files and max size of 2 MB</Typography>
                      </Box>
                    </div>
                    {files.length ? (
                      <Fragment>
                        <List>{fileList}</List>
                        <div className='buttons'></div>
                      </Fragment>
                    ) : null}
                  </Fragment>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleUpdate}>Upload</Button>
                </DialogActions>
              </Dialog>
            </Card>
          ) : null}
        </TabPanel>
        <TabPanel value='3'>
          {dataLoaded ? (
            <Card style={{ marginTop: '5px', marginLeft: '-23px', padding: '20px', width: '104%' }}>
              <Grid container spacing={2}>
                {data3 ? (
                  data3.map((task: any) => (
                    <Grid item key={task.id} xs={12} sm={6} md={4} lg={3}>
                      <Card
                        style={{
                          background:
                            task.code_assign === 0
                              ? '#ed2939' // Merah
                              : task.code_assign === 1
                              ? '#FFBF00' // Kuning
                              : task.code_assign === 2
                              ? '#00a86b' // Hijau
                              : 'transparent', // Warna default atau kosong
                          height: '400px'
                        }}
                      >
                        <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
                          <CardHeader
                            title={
                              <Typography
                                variant='h5'
                                sx={{
                                  textAlign: 'center',
                                  color: 'black',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 1, // Menyesuaikan jumlah baris yang diizinkan sebelum elipsis
                                  marginBottom: 0, // Menyesuaikan margin bawah
                                  fontWeight: 'bold'
                                }}
                              >
                                {task.cap_offtask}
                              </Typography>
                            }
                            style={{
                              backgroundColor: '#E2DFD2',
                              textAlign: 'center',
                              padding: '10px' // Menambahkan padding untuk meningkatkan tinggi CardHeader
                            }}
                          />
                        </div>
                        <CardContent style={{ padding: '25px' }}>
                          <Typography
                            sx={{
                              color: 'white',

                              fontWeight: 'bold'
                            }}
                          >
                            Keterangan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.note_offtask}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',

                              fontWeight: 'bold'
                            }}
                          >
                            Tanggal:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.tgl_offtask}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            File:
                            {task.str_file ? (
                              <a
                                href={`${baseURL}/detailtask/:?file=${task.str_file}`}
                                download={task.str_file}
                                style={{
                                  textDecoration: 'none',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Icon icon='flat-color-icons:file' color='black' width='50' height='50' />
                              </a>
                            ) : (
                              <span>-</span>
                            )}
                          </Typography>
                          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>Ditugaskan:</Typography>
                          <Typography sx={{ color: 'white', marginTop: -2 }}>{task.user_assign}</Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Komen Atasan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.code_assign === 2 && !task.reply_state ? '-' : '-'}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Catatan Bawahan:
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              marginTop: -2,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1
                            }}
                          >
                            {task.code_assign === 2 ? 'SELESAI' : task.reply_note ? task.reply_note : '-'}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            Progress:
                          </Typography>
                          <Typography>
                            <LinearProgressWithLabel value={task.progres || 0} />
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box
                      borderRadius={2}
                      p={2}
                      textAlign='center'
                      width='100%'
                      minHeight='250px'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Box borderRadius={1}>
                        <Typography variant='h6' style={{ color: '#CCCCCC' }}>
                          Tidak ada Tugas Selesai
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          ) : null}
        </TabPanel>
        <TabPanel value='4'>
          <Card style={{ marginTop: '5px', marginLeft: '-23px', padding: '20px', width: '104%' }}>
            {dataLoaded && data4 ? (
              <DataGrid
                autoHeight
                disableColumnFilter
                columns={columns}
                pageSizeOptions={[7, 10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rows={data4}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.125rem'
                  },
                  '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: '#FAF9F6' // Ganti warna latar belakang untuk baris ganjil
                  },
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: 'white' // Ganti warna latar belakang untuk baris genap
                  },
                  '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader': {
                    borderRight: '1px solid #e0e0e0' // Add right border to each header cell
                  },
                  '& .MuiDataGrid-cell': {
                    borderRight: '1px solid #e0e0e0' // Add right border to each cell
                  }
                }}
                slotProps={{
                  baseButton: {
                    size: 'medium',
                    variant: 'outlined'
                  }
                }}
              />
            ) : (
              <Grid item xs={12}>
                <Box
                  borderRadius={2}
                  p={2}
                  textAlign='center'
                  width='100%'
                  minHeight='250px'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Box borderRadius={1}>
                    <Typography variant='h6' style={{ color: '#CCCCCC' }}>
                      Tidak ada Database
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Card>
        </TabPanel>
      </TabContext>
    </>
  )
}

export default CardDaftarTugas
