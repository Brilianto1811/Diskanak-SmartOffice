import { ResponseDataMdRutinitas } from 'src/models/data-md-rutinitas'
import api from 'src/utils/api'

// GET BUAT FITUR RUTINITAS (KEG)
export const GetDataKegById = async (id_offpegawai: string, tgl_data: any) => {
  const response = await api.get<ResponseDataMdRutinitas>(`/get-datamdkegbyidpegawai2/${id_offpegawai}/${tgl_data}`)

  return response.data
}
export const GetDataKegByIdLaporan = async (id_offpegawai: string, tgl_data: any, cc_112: any) => {
  const response = await api.get<ResponseDataMdRutinitas>(
    `/get-datamdkegbyidpegawai2laporan/${id_offpegawai}/${tgl_data}/${cc_112}`
  )

  return response.data
}

// GET BUAT FITUR VALIDASI RUTINITAS (KEG)
export const GetDataKegValidasi = async (
  id_offpegawai: string,
  id_jabatan: any,
  id_bidang: any,
  id_bidangsub: any,
  tgl_data: any,
  plt_bidang: any,
  plt_bidangsub: any
) => {
  const response = await api.get<ResponseDataMdRutinitas>(
    `/get-datamdkegvalidasiweb/${id_offpegawai}/${id_jabatan}/${id_bidang}/${id_bidangsub}/${tgl_data}/${plt_bidang}/${plt_bidangsub}`
  )

  return response.data
}

export const GetDataKegGallery = async (id_offpegawai: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offpegawai', id_offpegawai)
    const response = await api.post<ResponseDataMdRutinitas>(`/get-datamdkeggaleri`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}

export const GetKegTerima = async (taskData: any) => {
  const response = await api.post(`/update-kegditerima`, taskData)

  return response.data
}
export const GetKegTolak = async (taskData: any) => {
  const response = await api.post(`/update-kegditolak`, taskData)

  return response.data
}
export const GetKegReset = async (taskData: any) => {
  const response = await api.post(`/update-kegreset`, taskData)

  return response.data
}

export const GetDataKeg = async (tgl_data: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('tgl_data', tgl_data)
    const response = await api.post<ResponseDataMdRutinitas>(`/get-datamdkeg`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}

export const InsertDataPostKeg = async (taskData: any) => {
  const response = await api.post(`/insert-keg`, taskData)

  return response.data
}

export const UpdateDataPostKeg = async (taskData: any) => {
  const response = await api.post<ResponseDataMdRutinitas>(`/update-keg`, taskData)

  return response.data
}

export const DeleteDataPostKeg = async (id_offkeg: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offkeg', id_offkeg)
    const response = await api.post<ResponseDataMdRutinitas>(`/delete-keg/:`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}
