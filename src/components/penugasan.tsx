// ** React Imports
import { Fragment, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Data Import
import { DataMdPenugasan } from 'src/models/data-md-penugasan'
import {
  InsertTask,
  UpdateTask,
  DeleteTask,
  GetPegawaiByCriteria,
  GetTaskById,
  UpdateResponse,
  UpdateResponseSelesai
} from 'src/store/module-penugasan'

import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Typography from '@mui/material/Typography'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Input from '@mui/material/Input'
import cloneDeep from 'clone-deep'
import dayjs, { Dayjs } from 'dayjs'
import { useDropzone } from 'react-dropzone'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import { baseURL } from 'src/utils/api'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import usedecodetoken from 'src/utils/decodecookies'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DataMdPenerimaTask } from 'src/models/data-md-penerimatask'
import { Icon } from '@iconify/react'
import CustomChip from 'src/@core/components/mui/chip'
import Divider from '@mui/material/Divider'
import CustomTextField from 'src/@core/components/mui/text-field'
import { CircularProgress, Grid } from '@mui/material'

interface FileProp {
  name: string
  type: string
  size: number
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const TablePenugasan = () => {
  const userStatusObj: UserStatusType = {
    0: 'error', // Belum Diterima
    1: 'warning', // Diterima
    2: 'success' // Complete
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

  const notifyerror = (msg: any) => {
    toast.error(msg, {
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

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      '/*': ['.']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      notifywarning('You can only upload 1 files & maximum size of 2 MB.')
    }
  })

  const handleDeleteClick = (id_penerimatask: string) => {
    DeleteTask(id_penerimatask)
      .then(() => {
        notifysuccess('Sukses Menghapus Data !')
        getDataPenugasan(selectedDate2.current)
        handleCloseDelete()
      })
      .catch(error => {
        console.error('Error deleting data:', error)
      })
  }

  const columns: GridColDef[] = [
    {
      field: 'proses',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Proses',
      flex: 0.2,
      minWidth: 150,
      renderCell(params) {
        const row: DataMdPenugasan = params.row

        const renderButtons = () => {
          switch (row.code_assign) {
            case 0:
              return (
                <>
                  <Button
                    onClick={() => {
                      setOpenEdit(true)
                      console.log('data edit', row)

                      // Parse the string into a Dayjs instance
                      const tglOfftaskDate = dayjs(row.tgl_offtask)
                      const jamOfftaskTime = dayjs(row.jam_offtask, 'HH:mm')
                      if (jamOfftaskTime.isValid()) {
                        setSelectedTime(jamOfftaskTime)
                      } else {
                        console.error('Invalid time format:', row.jam_offtask)
                      }
                      if (tglOfftaskDate.isValid()) {
                        setSelectedDate(tglOfftaskDate)
                      } else {
                        console.error('Invalid date format:', row.tgl_offtask)
                      }

                      setSelectedData(row)
                    }}
                  >
                    <Icon icon='mingcute:pencil-line' color='#FFA500' width='25' height='25' />
                  </Button>
                  <Button onClick={() => handleClickOpenDelete(row.id_penerimatask)}>
                    <Icon
                      icon='solar:trash-bin-minimalistic-linear'
                      color='#e3242b'
                      width='25'
                      height='25'
                      hFlip={true}
                    />
                  </Button>
                </>
              )

            case 1:
              // Only render the second button
              return (
                <>
                  <Button
                    onClick={() => {
                      setOpenLaporan(true)
                      setSelectedData(row)
                    }}
                  >
                    <Icon icon='foundation:clipboard-pencil' color='#0096FF' width='25' height='25' />
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenLaporanSelesai(true)
                      setSelectedData(row.id_penerimatask)
                    }}
                  >
                    <Icon icon='octicon:checklist-24' color='#50C878' width='25' height='25' />
                  </Button>
                </>
              )

            case 2:
              return null

            default:
              return null
          }
        }

        return <>{renderButtons()}</>
      }
    },
    {
      field: 'code_assign',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Status',
      flex: 0.2,
      minWidth: 165,
      renderCell(params) {
        const row: DataMdPenugasan = params.row
        const color = userStatusObj[row.code_assign.toString()] // Convert code_assign to string and access the corresponding color from userStatusObj
        type StatusKeys = 0 | 1 | 2
        const statusTitle: Record<StatusKeys, string> = {
          0: 'BELUM DITERIMA',
          1: 'DITERIMA',
          2: 'SUDAH SELESAI'
        }

        const title = statusTitle[row.code_assign as StatusKeys]

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={title}
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
      minWidth: 105
    },
    {
      field: 'jam_offtask',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Jam',
      flex: 0.2,
      minWidth: 105
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
      align: 'left',
      headerAlign: 'center',
      headerName: 'Keterangan',
      flex: 0.2,
      minWidth: 300
    },
    {
      field: 'reply_note',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Laporan',
      flex: 0.2,
      minWidth: 300
    },
    {
      field: 'str_file',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Referensi',
      flex: 0.2,
      minWidth: 110,
      renderCell(params) {
        const row: DataMdPenugasan = params.row

        const fileUrl = `${baseURL}/detailtask/:?file=${row.str_file}`

        return (
          <a href={fileUrl} target='_blank' rel='noopener noreferrer'>
            <Icon icon='flat-color-icons:file' style={{ fontSize: '45px' }} />
          </a>
        )
      }
    },
    {
      field: 'user_assign',
      align: 'left',
      headerAlign: 'center',
      headerName: 'Ditugaskan',
      flex: 0.2,
      minWidth: 250
    }
  ]
  const form = {
    id_offtask: '',
    id_offpegawai: '',
    tgl_offtask: '',
    jam_offtask: '',
    cap_offtask: '',
    note_offtask: '',
    user_assign: '',
    namaFileFoto: '',
    fileFoto: null,
    str_file: ''
  }
  const [mainInput, setMainInput] = useState(cloneDeep(form))
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(new AdapterDayjs().date())
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null)
  const [selectedPegawai, setSelectedPegawai] = useState<DataMdPenerimaTask[]>([])
  const [selectedData, setSelectedData] = useState<any>()
  const [dataPenerimaTask, setDataPenerimaTask] = useState<any>()
  const [dataPenugasanByCriteria, setDataPenugasanByCriteria] = useState<DataMdPenugasan[]>([])
  const [open, setOpen] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openLaporan, setOpenLaporan] = React.useState(false)
  const [openLaporanSelesai, setOpenLaporanSelesai] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [Delete, setDelete] = useState<string>('') as [string, React.Dispatch<React.SetStateAction<string>>]
  const [files, setFiles] = useState<File[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const selectedDate2 = useRef<Dayjs | null>(new AdapterDayjs().date())
  const [loading, setLoading] = useState<boolean>(false)

  const handleDateChange = async (date: Dayjs | null) => {
    setLoading(true)
    selectedDate2.current = date
    await fetchData(() => getDataPenugasan(date))
    await fetchData(() => getDataPenugasanByCriteria(date))
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

  useEffect(() => {
    // Function to get data
    const fetchData = async () => {
      setLoading(true);
      try {
        await getDataPenugasan(selectedDate2.current);
      } finally {
        // Set loading to false after a delay of 3 seconds
        setTimeout(() => {
          setLoading(false);
          setDataLoaded(true);
        }, 700);
      }
    };

    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleUpload = async () => {
    const decodedtoken = usedecodetoken()

    const bodyFormData = new FormData()
    bodyFormData.append('id_offpegawai', decodedtoken?.id_offpegawai)
    bodyFormData.append('tgl_offtask', selectedDate ? selectedDate.format('YYYY-MM-DD') : '')
    bodyFormData.append('jam_offtask', selectedTime ? selectedTime.format('HH:mm') : '')
    bodyFormData.append('cap_offtask', mainInput.cap_offtask)
    bodyFormData.append('note_offtask', mainInput.note_offtask)
    bodyFormData.append('user_assign', selectedPegawai.join(',')) // Menggunakan tanda koma sebagai pemisah

    // Tambahkan file jika ada
    if (files.length > 0) {
      files.forEach(file => {
        bodyFormData.append(`str_file`, file)
      })
    }
    try {
      const response = await InsertTask(bodyFormData)

      if (response.error === true) {
        notifyerror(response.pesan)
      } else {
        handleClose()
        notifysuccess(response.pesan)
        getDataPenugasan(selectedDate2.current)
        setMainInput(cloneDeep(form))
        setSelectedDate(new AdapterDayjs().date())
        setFiles([])
      }
    } catch (error: any) {
      console.error('Terjadi kesalahan:', error.pesan)
    }
  }

  const handleUpdate = async () => {
    const decodedtoken = usedecodetoken()
    if (!selectedData) return

    const id_offpegawai = decodedtoken?.id_offpegawai
    const id_offtask = selectedData?.id_offtask
    const tgl_offtask = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''
    const jam_offtask = selectedTime ? selectedTime.format('HH:mm') : ''
    const { cap_offtask } = selectedData
    const { note_offtask } = selectedData
    const user_assign = selectedPegawai.join(',')

    const bodyFormData = new FormData()

    bodyFormData.append('id_offpegawai', id_offpegawai)
    bodyFormData.append('id_offtask', id_offtask)
    bodyFormData.append('tgl_offtask', tgl_offtask)
    bodyFormData.append('jam_offtask', jam_offtask)
    bodyFormData.append('cap_offtask', cap_offtask)
    bodyFormData.append('note_offtask', note_offtask)
    bodyFormData.append('user_assign', user_assign)

    if (files.length > 0) {
      files.forEach(file => {
        bodyFormData.append(`str_file`, file)
      })
    }

    try {
      await UpdateTask(bodyFormData)
      handleCloseEdit()
      notifysuccess('Sukses Update Data !')
      getDataPenugasan(selectedDate2.current)
    } catch (ex: any) {
      // notifyerror(ex.response.data.pesan)
      // Handle the error
      // console.error(ex)
    }
  }
  const handleUpdateLaporan = async () => {
    if (!selectedData) return

    const { id_penerimatask } = selectedData
    const { reply_state } = selectedData

    const bodyFormData = new FormData()

    bodyFormData.append('id_penerimatask', id_penerimatask)
    bodyFormData.append('reply_state', reply_state)

    try {
      await UpdateResponse(bodyFormData)
      handleCloseLaporan()
      notifysuccess('Sukses Update Data !')
      getDataPenugasan(selectedDate2.current)
    } catch (ex: any) {
      // notifyerror(ex.response.data.pesan)
      // Handle the error
      // console.error(ex)
    }
  }

  const handleUpdateLaporanSelesai = async (id_penerimatask: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append('id_penerimatask', id_penerimatask)
    try {
      const response = await UpdateResponseSelesai(bodyFormData)
      handleCloseLaporanSelesai()
      notifysuccess(response.pesan)
      getDataPenugasan(selectedDate2.current)
    } catch (ex: any) {
      console.error(ex)
    }
  }

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
        <Icon icon='ph:x-circle-light' width='30' height='30' />
      </IconButton>
    </ListItem>
  ))

  useEffect(() => {
    setSelectedDate(new AdapterDayjs().date())
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }
  const handleCloseLaporan = () => {
    setOpenLaporan(false)
  }
  const handleCloseLaporanSelesai = () => {
    setOpenLaporanSelesai(false)
  }

  const handleClickOpenDelete = (id_penerimatask: any) => {
    setDelete(id_penerimatask)
    setOpenDelete(true)
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const getDataPenugasan = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetTaskById(
        decodedtoken?.id_offpegawai,
        selectedDate ? selectedDate.format('YYYY-MM') : ''
      )
      if (responseData && responseData.data) {
        const tmpData = responseData.data.map(val => ({ ...val, id: val.id_penerimatask }))
        setDataPenerimaTask(tmpData)
      } else {
        setDataPenerimaTask(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getDataPenugasanByCriteria = async (selectedDate: any) => {
    console.log(selectedDate)
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetPegawaiByCriteria(
        decodedtoken?.id_jabatan,
        decodedtoken?.id_bidang,
        decodedtoken?.id_bidangsub,
        decodedtoken?.plt_bidang,
        decodedtoken?.plt_bidangsub
      )
      const tmpData = responseData.data.map(val => ({
        ...val,
        id: val.id_jabatan,
        id_bidang: val.id_bidang,
        id_bidangsub: val.id_bidangsub,
        id_offpegawai: val.id_offpegawai,
        name_offpegawai: val.name_offpegawai
      }))
      setDataPenugasanByCriteria(tmpData)
      console.log(tmpData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckboxChange = (pegawaiId: any) => {
    if (selectedPegawai.includes(pegawaiId)) {
      // Jika pegawaiId sudah ada dalam selectedPegawai, hapus dari array
      setSelectedPegawai(prevSelected => prevSelected.filter(id => id !== pegawaiId))
    } else {
      // Jika pegawaiId belum ada dalam selectedPegawai, tambahkan ke array
      setSelectedPegawai(prevSelected => [...prevSelected, pegawaiId])
    }
  }

  useEffect(() => {
    getDataPenugasan(selectedDate2.current), getDataPenugasanByCriteria(selectedDate2.current)
  }, [])

  useEffect(() => {
    if (selectedData && selectedData.id_userassign) {
      setSelectedPegawai([selectedData.id_userassign])
    }
  }, [selectedData, setSelectedPegawai])

  const renderPegawaiCheckboxes = () => {
    return dataPenugasanByCriteria.map((pegawai: any) => (
      <div key={pegawai.id_offpegawai} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <Checkbox
          checked={selectedPegawai.includes(pegawai.id_offpegawai)}
          onChange={() => handleCheckboxChange(pegawai.id_offpegawai)}
        />
        <span style={{ marginLeft: '5px' }}>{pegawai.name_offpegawai}</span>
      </div>
    ))
  }

  const editrenderPegawaiCheckboxes = (pegawai: any) => {
    console.log(pegawai)

    return dataPenugasanByCriteria.map((pegawai: any) => {
      const isChecked =
        selectedPegawai.includes(pegawai.id_offpegawai) ||
        (selectedData && selectedData.id_userassign === pegawai.id_offpegawai)

      return (
        <div key={pegawai.id_offpegawai} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <Checkbox checked={isChecked} onChange={() => handleCheckboxChange(pegawai.id_offpegawai)} />
          <span style={{ marginLeft: '5px' }}>{pegawai.name_offpegawai}</span>
        </div>
      )
    })
  }

  return (
    <Card>
      <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
        <CardHeader
          title={
            <>
              <span style={{ color: 'black' }}>Penugasan</span> <br />
              <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>
                Penugasan Kegiatan Kepada Bawahan.
              </span>
            </>
          }
          style={{ backgroundColor: '#AFE1AF', textAlign: 'center' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          variant='outlined'
          onClick={() => {
            setOpen(true)
            setSelectedDate(new AdapterDayjs().date())
            const currentTime = dayjs()

            // Mengatur nilai selectedTime dengan waktu saat ini
            setSelectedTime(currentTime)
          }}
          sx={{
            backgroundColor: '#50C878',
            color: 'black',
            borderColor: '#03C04A',
            '&:hover': {
              color: 'black' // Warna teks saat tombol dihover
            }
          }}
        >
          Tambah Penugasan
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle
            style={{ textAlign: 'center', backgroundColor: '#50C878', marginTop: '-15px', fontSize: '20px' }}
          >
            Tambah Penugasan
          </DialogTitle>
          <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                  <Typography variant='body1' style={{ marginRight: '10px' }}>
                    Tanggal:
                  </Typography>
                  <DatePicker label='Masukkan Tanggal' value={selectedDate} onChange={date => setSelectedDate(date)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                  <Typography variant='body1' style={{ marginRight: '10px' }}>
                    Jam:
                  </Typography>
                  <TimePicker
                    label='Masukkan Jam'
                    value={selectedTime}
                    onChange={Time => setSelectedTime(Time)}
                    format='HH:mm'
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Kegiatan:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Judul Kegiatan Anda'
                    fullWidth
                    value={mainInput.cap_offtask}
                    onChange={e => setMainInput({ ...mainInput, cap_offtask: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Keterangan:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Keterangan dari Kegiatan anda'
                    fullWidth
                    value={mainInput.note_offtask}
                    onChange={e => setMainInput({ ...mainInput, note_offtask: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Ditugaskan Kepada:
                  </Typography>
                  {renderPegawaiCheckboxes()}
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Upload File:
                  </Typography>
                  <Fragment>
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input
                        value={mainInput.namaFileFoto}
                        onChange={$event => setMainInput({ ...mainInput, namaFileFoto: $event.target.value })}
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
                </div>
              </div>
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleUpload}>Tambah</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle
            style={{ textAlign: 'center', backgroundColor: '#FFA500', marginTop: '-15px', fontSize: '20px' }}
          >
            Edit Penugasan
          </DialogTitle>
          <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
          <DialogContent>
            {selectedData && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                    <Typography variant='body1' style={{ marginRight: '10px' }}>
                      Tanggal:
                    </Typography>
                    <DatePicker
                      label='Masukkan Tanggal'
                      value={selectedDate}
                      onChange={date => setSelectedDate(date)}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                    <Typography variant='body1' style={{ marginRight: '10px' }}>
                      Jam:
                    </Typography>
                    <TimePicker
                      label='Masukkan Jam'
                      value={selectedTime}
                      format='HH:mm'
                      onChange={Time => setSelectedTime(Time)}
                    />
                  </div>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                  >
                    <Typography variant='body1' style={{ marginRight: '21px' }}>
                      Kegiatan:
                    </Typography>
                    <CustomTextField
                      placeholder='Masukkan Judul Kegiatan Anda'
                      fullWidth
                      value={selectedData.cap_offtask}
                      onChange={e => setSelectedData({ ...selectedData, cap_offtask: e.target.value })}
                      style={{
                        width: '530px'
                      }}
                    />
                  </div>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                  >
                    <Typography variant='body1' style={{ marginRight: '21px' }}>
                      Keterangan:
                    </Typography>
                    <Input
                      title='Masukkan Keterangan dari Kegiatan anda'
                      placeholder='Masukkan Keterangan dari Kegiatan anda'
                      fullWidth
                      value={selectedData.note_offtask}
                      onChange={e => setSelectedData({ ...selectedData, note_offtask: e.target.value })}
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
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                  >
                    <Typography variant='body1' style={{ marginRight: '21px' }}>
                      Ditugaskan Kepada:
                    </Typography>
                    {editrenderPegawaiCheckboxes(selectedData.id_userassign)}
                  </div>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                  >
                    <Typography variant='body1' style={{ marginRight: '21px' }}>
                      Upload File:
                    </Typography>
                    <Fragment>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input
                          value={selectedData.namaFileFoto}
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
                  </div>
                </div>
              </LocalizationProvider>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleUpdate}>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openLaporan} onClose={handleCloseLaporan}>
          <DialogTitle
            style={{ textAlign: 'center', backgroundColor: '#0096FF', marginTop: '-15px', fontSize: '20px' }}
          >
            Update Perkembangan Tugas
          </DialogTitle>
          <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
          <DialogContent>
            {selectedData && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <CustomTextField
                    placeholder='Kirim Catatan'
                    fullWidth
                    value={selectedData.reply_state}
                    onChange={e => setSelectedData({ ...selectedData, reply_state: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLaporan}>Cancel</Button>
            <Button onClick={handleUpdateLaporan}>Simpan</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Apakah anda Yakin Untuk Menghapus Data ini?'}</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Cancel</Button>
            <Button onClick={() => handleDeleteClick(Delete)}>Delete</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openLaporanSelesai}
          onClose={handleCloseLaporanSelesai}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Apakah anda Yakin Untuk Menyelesaikan Tugas ini?'}</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseLaporanSelesai}>Cancel</Button>
            <Button onClick={() => handleUpdateLaporanSelesai(selectedData)}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '5px' }}>
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
      {dataLoaded && dataPenerimaTask ? (
      <DataGrid
        autoHeight
        disableColumnFilter
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={dataPenerimaTask}
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
                      Tidak ada Penugasan
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
    </Card>
  )
}

export default TablePenugasan
