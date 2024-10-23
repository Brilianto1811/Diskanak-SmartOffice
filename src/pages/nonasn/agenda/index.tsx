import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { GetAgenda } from 'src/store/module-agenda'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const AgendaNONASN = () => {
  const [agenda, setAgenda] = useState<any[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const columns: GridColDef[] = [
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
      minWidth: 250,
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
      <div style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}></div>

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
    </>
  )
}

export default AgendaNONASN
