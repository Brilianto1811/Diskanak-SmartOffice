import { ResponseDataMdPegawai } from 'src/models/data-md-pegawai'
import { ResponseDataMdStatistik } from 'src/models/data-md-statistik'
import { ResponseDataMdReportos } from 'src/models/dataa-md-offreportos'
import api from 'src/utils/api'

export const GetPegawai = async () => {
  const response = await api.get<ResponseDataMdPegawai>(`/get-datamdpegawai`)

  return response.data
}
export const GetStatistikTask = async () => {
  const response = await api.get<ResponseDataMdStatistik>(`/get-datamdstatistiktask`)

  return response.data
}
export const GetStatistikKeg = async () => {
  const response = await api.get<ResponseDataMdStatistik>(`/get-datamdstatistikkeg`)

  return response.data
}

export const GetLaporanKinerja = async (month_report: number) => {
  const response = await api.get<ResponseDataMdReportos>(`/get-datamdreportos/${month_report}`)

  return response.data
}

export const UpdateDataPegawai = async (id_offpegawai: string, str_pswd: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offpegawai', id_offpegawai)
    bodyFormData.append('str_pswd', str_pswd)
    const response = await api.post<ResponseDataMdPegawai>(`/update-datamdpegawai`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}

export const UpdateFotoPegawai = async (taskData: any) => {
  const response = await api.post(`/update-datamdpegawai`, taskData)

  return response.data
}


