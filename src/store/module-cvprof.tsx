import { ResponseDataMdCVProf } from 'src/models/data-md-cvprof'
import api from 'src/utils/api'

export const GetCVProf = async () => {
  const response = await api.get<ResponseDataMdCVProf>(`/get-datamdcvprof`)

  return response.data
}

export const InsertCVProf = async (taskData: any) => {
  const response = await api.post(`/insert-mdcvprof`, taskData)

  return response.data
}

export const UpdateCVProf = async (taskData: any) => {
  const response = await api.post<ResponseDataMdCVProf>(`/update-mdcvprof`, taskData)

  return response.data
}

export const DeleteCVProf = async (id_cvprof: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_cvprof', id_cvprof)
    const response = await api.post<ResponseDataMdCVProf>(`/delete-mdcvprof/:`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}
