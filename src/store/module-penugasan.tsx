import { ResponseDataMdPenerimaTask } from 'src/models/data-md-penerimatask'
import { ResponseDataMdPenugasan } from 'src/models/data-md-penugasan'
import api from 'src/utils/api'

export const GetTask = async () => {
  const response = await api.get<ResponseDataMdPenugasan>(`/get-datamdtask`)

  return response.data
}

//GET DATA UNTUK FITUR PENUGASAN (TASK)
export const GetTaskById = async (id_offpegawai: string, tgl_data: any) => {
  const response = await api.get<ResponseDataMdPenerimaTask>(`/get-datamdpenerimataskacc2/${id_offpegawai}/${tgl_data}`)

  return response.data
}

// GET DATA UNTUK FITUR DAFTAR TUGAS DI TAB YANG DAFTAR TUGAS (CODE_ASSIGN 0)
export const GetTaskByIdPegawai = async (id_offpegawai: string, code_assign: any, tgl_data: any) => {
  const response = await api.get<ResponseDataMdPenerimaTask>(
    `/get-datamdpenerimataskuser/${id_offpegawai}/${code_assign}/${tgl_data}`
  )

  return response.data
}

// GET DATA UNTUK FITUR DAFTAR TUGAS DI TAB YANG DAFTAR TUGAS (CODE_ASSIGN 1)
export const GetTaskByIdPegawai2 = async (id_offpegawai: string, code_assign: any, tgl_data: any) => {
  const response = await api.get<ResponseDataMdPenerimaTask>(
    `/get-datamdpenerimataskuser/${id_offpegawai}/${code_assign}/${tgl_data}`
  )

  return response.data
}

// GET DATA UNTUK FITUR DAFTAR TUGAS DI TAB YANG DAFTAR TUGAS (CODE_ASSIGN 2)
export const GetTaskByIdPegawai3 = async (id_offpegawai: string, code_assign: any, tgl_data: any) => {
  const response = await api.get<ResponseDataMdPenerimaTask>(
    `/get-datamdpenerimataskuser/${id_offpegawai}/${code_assign}/${tgl_data}`
  )

  return response.data
}
export const GetTaskByIdPegawai3Laporan = async (id_offpegawai: string, code_assign: any, tgl_data: any, cc_112: any) => {
  const response = await api.get<ResponseDataMdPenerimaTask>(
    `/get-datamdpenerimataskuserlaporan/${id_offpegawai}/${code_assign}/${tgl_data}/${cc_112}`
  )

  return response.data
}

// GET DATA UNTUK FITUR DAFTAR TUGAS SEMUA UNTUK CODE ASSIGN 0,1,2 (TAB YANG DATABASE MUNCULIN SEMUA)
export const GetTaskByIdPegawai4 = async (id_userassign: string, code_assign: any, tgl_data: any) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_userassign', id_userassign)
    bodyFormData.append('code_assign', code_assign)
    bodyFormData.append('tgl_data', tgl_data)
    const response = await api.post<ResponseDataMdPenerimaTask>(`/get-datamdpenerimataskuser2`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}

// UNTUK BUTTON TERIMA PADA CODE_ASSIGN 0 DI FITUR DAFTAR TUGAS BAGIAN TAB DAFTAR TUGAS
export const GetTaskTerima = async (taskData: any) => {
  const response = await api.post(`/update-penerimataskditerima`, taskData)

  return response.data
}

export const GetPegawaiByCriteria = async (
  id_jabatan: string,
  id_bidang: string,
  id_bidangsub: string,
  plt_bidang: any,
  plt_bidangsub: any
) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_jabatan', id_jabatan)
    bodyFormData.append('id_bidang', id_bidang)
    bodyFormData.append('id_bidangsub', id_bidangsub)
    bodyFormData.append('plt_bidang', plt_bidang)
    bodyFormData.append('plt_bidangsub', plt_bidangsub)
    const response = await api.post<ResponseDataMdPenugasan>(`/get-pegawaitaskcriteria`, bodyFormData)

    return response.data
  } catch (error) {
    throw error
  }
}

export const DetailFileTask = async (str_file: string) => {
  const response = await api.get(`/detailtask/:=${str_file}`)

  return response.data
}

export const InsertTask = async (taskData: any) => {
  const response = await api.post(`/insert-taskpengirim`, taskData)

  return response.data
}
export const UpdateTask = async (taskData: any) => {
  const response = await api.post(`/update-pengirimtask`, taskData)

  return response.data
}
export const UpdateLaporanTask = async (taskData: any) => {
  const response = await api.post(`/update-penerimatask`, taskData)

  return response.data
}
export const UpdateResponse = async (taskData: any) => {
  const response = await api.post(`/update-taskresponsepengirim`, taskData)

  return response.data
}
export const UpdateResponseSelesai = async (taskData: any) => {
  const response = await api.post(`/update-penerimataskselesai`, taskData)

  return response.data
}

export const DeleteTask = async (id_penerimatask: string) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('id_penerimatask', id_penerimatask)
    const response = await api.post<ResponseDataMdPenugasan>(`/delete-penerimatask/:`, bodyFormData)

    return response.data.pesan
  } catch (error) {
    throw error
  }
}
