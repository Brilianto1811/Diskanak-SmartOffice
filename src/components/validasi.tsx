// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
import { DataMdRutinitas } from 'src/models/data-md-rutinitas'
import { GetDataKegValidasi, GetKegReset, GetKegTerima, GetKegTolak } from 'src/store/module-rutinitas'
import React from 'react'
import usedecodetoken from 'src/utils/decodecookies'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeColor } from 'src/@core/layouts/types'
import CustomChip from 'src/@core/components/mui/chip'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'
import { baseURL } from 'src/utils/api'
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'

interface UserStatusType {
  [key: string]: ThemeColor
}

const TableValidasi = () => {
  const userStatusObj: UserStatusType = {
    '0': 'warning', // Belum Diterima
    '1': 'success', // Diterima
    '2': 'error' // Complete
  }
  const [dataValidasi, setDataValidasi] = useState<DataMdRutinitas[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [openDialog, setOpenDialog] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)
  const selectedDate2 = useRef<Dayjs | null>(new AdapterDayjs().date())
  const [loading, setLoading] = useState<boolean>(false)

  const handleDateChange = async (date: Dayjs | null) => {
    setLoading(true) // Set loading to true when starting to fetch data
    selectedDate2.current = date
    await fetchData(() => getDataValidasi(date))
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
      setLoading(true)
      try {
        await getDataValidasi(selectedDate2.current)
      } finally {
        // Set loading to false after a delay of 3 seconds
        setTimeout(() => {
          setLoading(false)
          setDataLoaded(true)
        }, 700)
      }
    }

    // Fetch data when component mounts
    fetchData()
  }, [])

  const handleAvatarClick = (imageUrl: any) => {
    setCurrentImage(imageUrl)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
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

  const handleTerimaClick = async (id_offkeg: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offkeg', id_offkeg)
    try {
      const response = await GetKegTerima(bodyFormData)
      notifysuccess(response.pesan)
      getDataValidasi(selectedDate2.current)
    } catch (ex: any) {
      console.error(ex)
    }
  }
  const handleTolakClick = async (id_offkeg: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offkeg', id_offkeg)
    try {
      const response = await GetKegTolak(bodyFormData)
      notifysuccess(response.pesan)
      getDataValidasi(selectedDate2.current)
    } catch (ex: any) {
      console.error(ex)
    }
  }
  const handleResetClick = async (id_offkeg: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offkeg', id_offkeg)
    try {
      const response = await GetKegReset(bodyFormData)
      notifysuccess(response.pesan)
      getDataValidasi(selectedDate2.current)
    } catch (ex: any) {
      console.error(ex)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name_offpegawai',
      align: 'left',
      headerName: 'Nama Pegawai',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 255
    },
    {
      field: 'proses',
      align: 'center',
      headerName: 'Proses',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 180,
      renderCell(params) {
        const row = params.row
        let buttonsToRender

        if (row.code_assign === 0) {
          buttonsToRender = (
            <>
              <CustomChip
                label='TERIMA'
                skin='light'
                size='small'
                color='success'
                onClick={() => handleTerimaClick(row.id_offkeg)}
                sx={{ textTransform: 'capitalize', borderRadius: 0.9, marginRight: 3 }}
              />
              <CustomChip
                label='TOLAK'
                skin='light'
                size='small'
                color='error'
                onClick={() => handleTolakClick(row.id_offkeg)}
                sx={{ textTransform: 'capitalize', borderRadius: 0.8 }}
              />
            </>
          )
        } else if (row.code_assign === 1 || row.code_assign === 2) {
          buttonsToRender = (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <CustomChip
                label='RESET'
                skin='light'
                size='small'
                color='warning'
                onClick={() => handleResetClick(row.id_offkeg)}
                sx={{ textTransform: 'capitalize', borderRadius: 0.7 }}
              />
            </div>
          )
        } else {
          buttonsToRender = null
        }

        return <>{buttonsToRender}</>
      }
    },
    {
      field: 'code_assign',
      align: 'center',
      headerName: 'Status',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 200,
      renderCell(params) {
        const row: DataMdRutinitas = params.row
        const color = userStatusObj[row.code_assign.toString()] // Convert code_assign to string and access the corresponding color from userStatusObj
        const statusTitle = {
          '0': 'BELUM DIVALIDASI',
          '1': 'DIVALIDASI',
          '2': 'DITOLAK'
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
      field: 'tgl_offkeg',
      headerName: 'Tanggal',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 110
    },
    {
      field: 'cap_offkeg',
      headerName: 'Kegiatan',
      headerAlign: 'center',
      flex: 0.275,
      minWidth: 290
    },
    {
      field: 'str_file',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Foto Kegiatan',
      flex: 0.2,
      minWidth: 250,
      renderCell(params) {
        const row: DataMdRutinitas = params.row
        const imageUrl =
          row.str_file && row.str_file.length > 0
            ? `${baseURL}/detailkeg/:?file=${row.str_file}`
            : '/images/diskominfo/user2.png'

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={imageUrl}
              alt={row.str_file}
              style={{
                width: '80px',
                height: '40px',
                cursor: 'pointer',
                marginRight: '10px',
                borderRadius: '5%',
                border: '1px solid grey',
                objectFit: 'cover'
              }}
              onClick={() => handleAvatarClick(imageUrl)}
            />
          </div>
        )
      }
    },
    {
      field: 'jam_offkeg2',
      align: 'center',
      headerName: 'Waktu Mulai',
      headerAlign: 'center',
      flex: 0.275,
      minWidth: 150
    },
    {
      field: 'jam_offkeg',
      align: 'center',
      headerName: 'Waktu Selesai',
      headerAlign: 'center',
      flex: 0.275,
      minWidth: 150
    },
    {
      field: 'note_offkeg',
      headerName: 'Keterangan',
      headerAlign: 'center',
      flex: 0.2,
      minWidth: 250
    }
  ]

  const getDataValidasi = async (selectedDate: any) => {
    try {
      const decodedtoken = usedecodetoken()
      const responseData = await GetDataKegValidasi(
        decodedtoken?.id_offpegawai,
        decodedtoken?.id_jabatan,
        decodedtoken?.id_bidang,
        decodedtoken?.id_bidangsub,
        selectedDate ? selectedDate.format('YYYY-MM') : '',
        decodedtoken?.plt_bidang,
        decodedtoken?.plt_bidangsub
      )

      const tmpData = responseData.data.map(val => ({ ...val, id: val.id_offkeg }))
      setDataValidasi(tmpData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDataValidasi(selectedDate2.current)
  }, [])

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center' }}>DETAIL FOTO</DialogTitle>
        <DialogContent>
          <img src={currentImage} alt='Dialog' style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
      <Card>
        <div style={{ borderBottom: '1px', textAlign: 'center', justifyContent: 'center' }}>
          <CardHeader
            title={
              <>
                <span style={{ color: 'black' }}>Validasi</span> <br />
                <span style={{ fontSize: '0.875rem', marginTop: '5px', color: '#555' }}>
                  Validasi Rutinitas Bawahan
                </span>
              </>
            }
            style={{ backgroundColor: '#AFE1AF', textAlign: 'center' }}
          />
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
        {dataLoaded && dataValidasi ? (
          <DataGrid
            autoHeight
            disableColumnFilter
            columns={columns}
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rows={dataValidasi}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: '1.125rem'
              },
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: '#FAF9F6'
              },
              '& .MuiDataGrid-row:nth-of-type(even)': {
                backgroundColor: 'white'
              },
              '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader': {
                borderRight: '1px solid #e0e0e0'
              },
              '& .MuiDataGrid-cell': {
                borderRight: '1px solid #e0e0e0'
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
                  Tidak ada Validasi
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Card>
    </>
  )
}

export default TableValidasi
