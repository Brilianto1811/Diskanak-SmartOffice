import { ResponseDataMdPegawai } from 'src/models/data-md-pegawai'
import { ResponseDataMdReportos } from 'src/models/dataa-md-offreportos'
import api from 'src/utils/api'

export const GetReportOS = async (month_report: any) => {
  const response = await api.get<ResponseDataMdReportos>(`/get-datamdreportos/${month_report}`)

  return response.data
}
export const GetNamaPegawaiBidangdanBidangSub = async (id_bidang: any, id_bidangsub: any) => {
  const response = await api.get<ResponseDataMdPegawai>(`/get-datamdpegawaireportos/${id_bidang}/${id_bidangsub}`)

  return response.data
}

export const InsertReportOS = async (taskData: any) => {
  const response = await api.post(`/insert-reportos`, taskData)

  return response.data
}

export const UpdateReportOS = async (taskData: any) => {
  const response = await api.post<ResponseDataMdReportos>(`/update-reportos`, taskData)

  return response.data
}

export const DeleteReportOS = async (id_offreportos: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offreportos', id_offreportos)
    const response = await api.post<ResponseDataMdReportos>(`/delete-reportos/:`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}
