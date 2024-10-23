import { ResponseDataMdAgenda } from 'src/models/data-md-agenda'
import api from 'src/utils/api'

export const GetAgenda = async () => {
  const response = await api.get<ResponseDataMdAgenda>(`/get-datamdoffagenda`)

  return response.data
}

export const InsertAgenda = async (taskData: any) => {
  const response = await api.post(`/insert-offagenda`, taskData)

  return response.data
}

export const UpdateAgenda = async (taskData: any) => {
  const response = await api.post<ResponseDataMdAgenda>(`/update-offagenda`, taskData)

  return response.data
}

export const DeleteAgenda = async (id_offagenda: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_offagenda', id_offagenda)
    const response = await api.post<ResponseDataMdAgenda>(`/delete-offagenda/:`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}
