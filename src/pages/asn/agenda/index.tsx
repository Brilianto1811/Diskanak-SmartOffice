import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { DeleteAgenda, GetAgenda, InsertAgenda, UpdateAgenda } from 'src/store/module-agenda'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { DataMdAgenda } from 'src/models/data-md-agenda'
import { Icon } from '@iconify/react'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CustomTextField from 'src/@core/components/mui/text-field'
import cloneDeep from 'clone-deep'
import usedecodetoken from 'src/utils/decodecookies'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dayjs, { Dayjs } from 'dayjs'

const AgendaASN = () => {
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

  const form = {
    name_offagenda: '',
    id_offpegawai: '',
    tgl_kegiatan: '',
    waktu_kegiatan: '',
    waktu_mulai: '',
    waktu_selesai: '',
    lokasi_kegiatan: '',
    id_ruangrapat: '',
    id_dispo: '',
    comt_offagenda: ''
  }

  const [open, setOpen] = useState(false)
  const [agenda, setAgenda] = useState<any[]>([])
  const [openEdit, setOpenEdit] = React.useState(false)
  const [selectedData, setSelectedData] = useState<any>()
  const [openDelete, setOpenDelete] = React.useState(false)
  const [Delete, setDelete] = useState<string>('') as [string, React.Dispatch<React.SetStateAction<string>>]
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(new AdapterDayjs().date())
  const [mainInput, setMainInput] = useState(cloneDeep(form))
  const [beforeselectedTime, setBeforeSelectedTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'))
  const [afterselectedTime, setAfterSelectedTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T00:00'))

  const handleClickOpenDelete = (id_penerimatask: any) => {
    setDelete(id_penerimatask)
    setOpenDelete(true)
  }

  const handleUpload = async () => {
    const decodedtoken = usedecodetoken()

    const bodyFormData = new FormData()
    bodyFormData.append('id_offpegawai', decodedtoken?.id_offpegawai)
    bodyFormData.append('name_offagenda', mainInput.name_offagenda)
    bodyFormData.append('tgl_kegiatan', selectedDate ? selectedDate.format('YYYY-MM-DD') : '')
    bodyFormData.append('waktu_kegiatan', mainInput.waktu_kegiatan)
    bodyFormData.append('waktu_mulai', beforeselectedTime ? beforeselectedTime.format('HH:mm:ss') : '')
    bodyFormData.append('waktu_selesai', afterselectedTime ? afterselectedTime.format('HH:mm:ss') : '')
    bodyFormData.append('lokasi_kegiatan', mainInput.lokasi_kegiatan)
    bodyFormData.append('id_ruangrapat', mainInput.id_ruangrapat)
    bodyFormData.append('id_dispo', mainInput.id_dispo)
    bodyFormData.append('comt_offagenda', mainInput.comt_offagenda)

    try {
      const response = await InsertAgenda(bodyFormData)

      if (response.error === true) {
        notifyerror(response.pesan)
      } else {
        handleCloseDialog()
        notifysuccess(response.pesan)
        GetDataAgenda()
        setMainInput(cloneDeep(form))
        setSelectedDate(new AdapterDayjs().date())
      }
    } catch (error: any) {
      console.error('Terjadi kesalahan:', error.pesan)
    }
  }

  const handleUpdate = async () => {
    const decodedtoken = usedecodetoken()
    if (!selectedData) return

    const id_offpegawai = decodedtoken?.id_offpegawai
    const { id_offagenda } = selectedData
    const { name_offagenda } = selectedData
    const tgl_kegiatan = selectedDate ? selectedDate.format('YYYY-MM-DD') : ''
    const { waktu_kegiatan } = selectedData
    const waktu_mulai = beforeselectedTime ? beforeselectedTime.format('HH:mm:ss') : ''
    const waktu_selesai = afterselectedTime ? afterselectedTime.format('HH:mm:ss') : ''
    const { lokasi_kegiatan } = selectedData
    const { id_ruangrapat } = selectedData
    const { id_dispo } = selectedData
    const { comt_offagenda } = selectedData

    const bodyFormData = new FormData()

    bodyFormData.append('id_offpegawai', id_offpegawai)
    bodyFormData.append('id_offagenda', id_offagenda)
    bodyFormData.append('name_offagenda', name_offagenda)
    bodyFormData.append('tgl_kegiatan', tgl_kegiatan)
    bodyFormData.append('waktu_kegiatan', waktu_kegiatan)
    bodyFormData.append('waktu_mulai', waktu_mulai)
    bodyFormData.append('waktu_selesai', waktu_selesai)
    bodyFormData.append('lokasi_kegiatan', lokasi_kegiatan)
    bodyFormData.append('id_ruangrapat', id_ruangrapat)
    bodyFormData.append('id_dispo', id_dispo)
    bodyFormData.append('comt_offagenda', comt_offagenda)

    try {
      const response = await UpdateAgenda(bodyFormData)

      if (response.error === true) {
        notifyerror(response.pesan)
      } else {
        handleCloseEdit()
        notifysuccess(response.pesan)
        GetDataAgenda()
        setSelectedDate(new AdapterDayjs().date())
      }
    } catch (error: any) {
      console.error('Terjadi kesalahan:', error.pesan)
    }
  }

  const handleDeleteClick = (id_offagenda: string) => {
    DeleteAgenda(id_offagenda)
      .then(() => {
        notifysuccess('Sukses Menghapus Data !')
        GetDataAgenda()
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
      headerName: 'Action',
      flex: 0.2,
      minWidth: 150,
      renderCell(params) {
        const row: DataMdAgenda = params.row

        return (
          <>
            <Button
              onClick={() => {
                setOpenEdit(true)
                console.log('data edit', row)
                const tglOffagendaDate = dayjs(row.tgl_kegiatan)
                const jamOffagendaTime = dayjs(row.waktu_mulai, 'HH:mm')
                const jamOffagendaTime2 = dayjs(row.waktu_selesai, 'HH:mm')

                if (tglOffagendaDate.isValid()) {
                  setSelectedDate(tglOffagendaDate)
                } else {
                  console.error('Invalid date format:', row.tgl_kegiatan)
                }

                if (jamOffagendaTime.isValid()) {
                  setBeforeSelectedTime(jamOffagendaTime)
                } else {
                  console.error('Invalid time format:', row.waktu_mulai)
                }

                if (jamOffagendaTime2.isValid()) {
                  setAfterSelectedTime(jamOffagendaTime2)
                } else {
                  console.error('Invalid time format:', row.waktu_selesai)
                }

                setSelectedData(row)
              }}
            >
              <Icon icon='mingcute:pencil-line' color='#0e49b5' width='25' height='25' />
            </Button>
            <Button onClick={() => handleClickOpenDelete(row.id_offagenda)}>
              <Icon icon='solar:trash-bin-minimalistic-linear' color='#e3242b' width='25' height='25' hFlip={true} />
            </Button>
          </>
        )
      }
    },

    {
      field: 'name_offpegawai',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Penanggung Jawab',
      flex: 0.2,
      minWidth: 250
    },
    {
      field: 'id_dispo',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Disposisi',
      flex: 0.2,
      minWidth: 150,
      renderCell: params => {
        let displayText = ''
        switch (params.value) {
          case 1:
            displayText = 'Agenda Dinas'
            break
          case 2:
            displayText = 'Agenda Bidang'
            break
          case 3:
            displayText = 'Agenda Seksi'
            break
          default:
            displayText = '-' // or any default text
        }

        return <span>{displayText}</span>
      }
    },
    {
      field: 'name_offagenda',
      headerName: 'Nama Agenda',
      flex: 0.275,
      minWidth: 290
    },
    {
      field: 'tgl_kegiatan',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Tanggal Kegiatan',
      flex: 0.2,
      minWidth: 180
    },
    {
      field: 'waktu_kegiatan',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Waktu Kegiatan',
      flex: 0.2,
      minWidth: 180,
      renderCell: params => {
        const displayText = params.value === 0 ? 'Pagi' : params.value === 1 ? 'Siang' : '-' // Adjust "Unknown" as needed

        return <span>{displayText}</span>
      }
    },
    {
      field: 'waktu_mulai',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Waktu Mulai',
      flex: 0.2,
      minWidth: 150
    },
    {
      field: 'waktu_selesai',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Waktu Selesai',
      flex: 0.2,
      minWidth: 150
    },
    {
      field: 'lokasi_kegiatan',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Lokasi',
      flex: 0.2,
      minWidth: 250
    }
  ]

  const GetDataAgenda = async () => {
    try {
      const responseData = await GetAgenda()
      const tmpData = responseData.data.map(val => ({
        ...val,
        id: val.id_offagenda,
        title: val.name_offagenda,
        start: val.tgl_kegiatan
      }))
      setAgenda(tmpData)
      console.log(responseData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    GetDataAgenda()
  }, [])

  const handleCloseDialog = () => {
    setOpen(false)
  }
  const handleCloseEdit = () => {
    setOpenEdit(false)
  }
  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  return (
    <>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={'dayGridMonth'}
          headerToolbar={{ start: 'today prev,next', center: 'title', end: 'dayGridMonth timeGridWeek, timeGridDay' }}
          selectable={true}
          events={agenda}
          nowIndicator={true}
        />
      </div>
      <div style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}>
        <Button
          variant='outlined'
          onClick={() => {
            setOpen(true)
            setSelectedDate(new AdapterDayjs().date())
            const currentTime = dayjs()

            setBeforeSelectedTime(currentTime)
            setAfterSelectedTime(currentTime)
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
          Tambah Agenda
        </Button>
      </div>

      <DataGrid
        autoHeight
        disableColumnFilter
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rows={agenda}
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

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center', backgroundColor: '#50C878', marginTop: '-15px', fontSize: '20px' }}>
          Tambah Agenda
        </DialogTitle>
        <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant='body1' style={{ marginRight: '10px' }}>
                  Tanggal Kegiatan:
                </Typography>
                <DatePicker
                  label='Masukkan Tanggal Kegiatan'
                  value={selectedDate}
                  onChange={date => setSelectedDate(date)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant='body1'>Waktu Agenda:</Typography>
                <RadioGroup
                  row
                  aria-label='waktu-kegiatan'
                  name='waktu-kegiatan'
                  value={mainInput.waktu_kegiatan}
                  onChange={e => setMainInput({ ...mainInput, waktu_kegiatan: e.target.value })}
                  style={{ marginLeft: '30px' }}
                >
                  <FormControlLabel value='0' control={<Radio />} label='Pagi' />
                  <FormControlLabel value='1' control={<Radio />} label='Siang' />
                </RadioGroup>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant='body1' style={{ marginRight: '21px' }}>
                  Waktu:
                </Typography>
                <TimePicker
                  label='Waktu Mulai'
                  value={beforeselectedTime}
                  onChange={time => setBeforeSelectedTime(time)}
                  format='HH:mm' // Format 24 jam
                />
                <TimePicker
                  label='Waktu Selesai'
                  value={afterselectedTime}
                  onChange={time => setAfterSelectedTime(time)}
                  format='HH:mm' // Format 24 jam
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                <Typography variant='body1' style={{ marginBottom: '10px' }}>
                  Disposisi:
                </Typography>
                <RadioGroup
                  aria-label='disposisi'
                  name='disposisi'
                  value={mainInput.id_dispo}
                  onChange={e => setMainInput({ ...mainInput, id_dispo: e.target.value })}
                  style={{ flexDirection: 'row' }}
                >
                  <FormControlLabel value='1' control={<Radio />} label='Agenda Dinas' />
                  <FormControlLabel value='2' control={<Radio />} label='Agenda Bidang' />
                  <FormControlLabel value='3' control={<Radio />} label='Agenda Seksi' />
                </RadioGroup>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                <Typography variant='body1' style={{ marginBottom: '10px' }}>
                  Ruang Rapat :
                </Typography>
                <RadioGroup
                  aria-label='ruang rapat'
                  name='ruang rapat'
                  value={mainInput.id_ruangrapat}
                  onChange={e => setMainInput({ ...mainInput, id_ruangrapat: e.target.value })}
                  style={{ flexDirection: 'row' }}
                >
                  <FormControlLabel value='0' control={<Radio />} label='Tidak Menggunakan Ruang Rapat' />
                  <FormControlLabel value='7' control={<Radio />} label='RR Kepala Dinas' />
                  <FormControlLabel value='8' control={<Radio />} label='RR Sekertaris Dinas' />
                  <FormControlLabel value='9' control={<Radio />} label='RR Bidang Aptika' />
                  <FormControlLabel value='10' control={<Radio />} label='RR Bidang IT' />
                  <FormControlLabel value='11' control={<Radio />} label='Aula Dinas' />
                </RadioGroup>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
                <Typography variant='body1' style={{ marginRight: '21px' }}>
                  Nama Agenda:
                </Typography>
                <CustomTextField
                  placeholder='Masukkan Agenda'
                  fullWidth
                  value={mainInput.name_offagenda}
                  onChange={e => setMainInput({ ...mainInput, name_offagenda: e.target.value })}
                  style={{
                    width: '530px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                <Typography variant='body1' style={{ marginRight: '21px' }}>
                  Keterangan:
                </Typography>
                <CustomTextField
                  placeholder='Masukkan Keterangan'
                  fullWidth
                  value={mainInput.comt_offagenda}
                  onChange={e => setMainInput({ ...mainInput, comt_offagenda: e.target.value })}
                  style={{
                    width: '530px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
                <Typography variant='body1' style={{ marginRight: '21px' }}>
                  Lokasi:
                </Typography>
                <CustomTextField
                  placeholder='Masukkan Lokasi'
                  fullWidth
                  value={mainInput.lokasi_kegiatan}
                  onChange={e => setMainInput({ ...mainInput, lokasi_kegiatan: e.target.value })}
                  style={{
                    width: '530px'
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpload}>Tambah</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle style={{ textAlign: 'center', backgroundColor: '#50C878', marginTop: '-15px', fontSize: '20px' }}>
          Edit Agenda
        </DialogTitle>
        <Divider style={{ margin: '10px 0', marginTop: '10px' }} />
        <DialogContent>
          {selectedData && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '-15px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                  <Typography variant='body1' style={{ marginRight: '10px' }}>
                    Tanggal Kegiatan:
                  </Typography>
                  <DatePicker
                    label='Masukkan Tanggal Kegiatan'
                    value={selectedDate}
                    onChange={date => setSelectedDate(date)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
                  <Typography variant='body1'>Waktu Agenda:</Typography>
                  <RadioGroup
                    row
                    aria-label='waktu-kegiatan'
                    name='waktu-kegiatan'
                    value={selectedData.waktu_kegiatan}
                    onChange={e => setSelectedData({ ...selectedData, waktu_kegiatan: e.target.value })}
                    style={{ marginLeft: '30px' }}
                  >
                    <FormControlLabel value='0' control={<Radio />} label='Pagi' />
                    <FormControlLabel value='1' control={<Radio />} label='Siang' />
                  </RadioGroup>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Waktu:
                  </Typography>
                  <TimePicker
                    label='Waktu Mulai'
                    value={beforeselectedTime}
                    onChange={time => setBeforeSelectedTime(time)}
                    format='HH:mm' // Format 24 jam
                  />
                  <TimePicker
                    label='Waktu Selesai'
                    value={afterselectedTime}
                    onChange={time => setAfterSelectedTime(time)}
                    format='HH:mm' // Format 24 jam
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                >
                  <Typography variant='body1' style={{ marginBottom: '10px' }}>
                    Disposisi:
                  </Typography>
                  <RadioGroup
                    aria-label='disposisi'
                    name='disposisi'
                    value={selectedData.id_dispo}
                    onChange={e => setSelectedData({ ...selectedData, id_dispo: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel value='1' control={<Radio />} label='Agenda Dinas' />
                    <FormControlLabel value='2' control={<Radio />} label='Agenda Bidang' />
                    <FormControlLabel value='3' control={<Radio />} label='Agenda Seksi' />
                  </RadioGroup>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                >
                  <Typography variant='body1' style={{ marginBottom: '10px' }}>
                    Ruang Rapat :
                  </Typography>
                  <RadioGroup
                    aria-label='ruang rapat'
                    name='ruang rapat'
                    value={selectedData.id_ruangrapat}
                    onChange={e => setSelectedData({ ...selectedData, id_ruangrapat: e.target.value })}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel value='0' control={<Radio />} label='Tidak Menggunakan Ruang Rapat' />
                    <FormControlLabel value='7' control={<Radio />} label='RR Kepala Dinas' />
                    <FormControlLabel value='8' control={<Radio />} label='RR Sekertaris Dinas' />
                    <FormControlLabel value='9' control={<Radio />} label='RR Bidang Aptika' />
                    <FormControlLabel value='10' control={<Radio />} label='RR Bidang IT' />
                    <FormControlLabel value='11' control={<Radio />} label='Aula Dinas' />
                  </RadioGroup>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Nama Agenda:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Agenda'
                    fullWidth
                    value={selectedData.name_offagenda}
                    onChange={e => setSelectedData({ ...selectedData, name_offagenda: e.target.value })}
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
                    placeholder='Masukkan Keterangan'
                    fullWidth
                    value={selectedData.comt_offagenda}
                    onChange={e => setSelectedData({ ...selectedData, comt_offagenda: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}
                >
                  <Typography variant='body1' style={{ marginRight: '21px' }}>
                    Lokasi:
                  </Typography>
                  <CustomTextField
                    placeholder='Masukkan Lokasi'
                    fullWidth
                    value={selectedData.lokasi_kegiatan}
                    onChange={e => setSelectedData({ ...selectedData, lokasi_kegiatan: e.target.value })}
                    style={{
                      width: '530px'
                    }}
                  />
                </div>
              </div>
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleUpdate}>Tambah</Button>
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
    </>
  )
}

export default AgendaASN
