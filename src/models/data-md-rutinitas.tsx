export interface ResponseDataMdRutinitas {
  data: DataMdRutinitas[]
  error: boolean
  pesan: string
}

export interface DataMdRutinitas {
  id_bidangsub: string
  id_bidang: string
  id_jabatan: string
  cap_offkeg: string
  code_assign: number
  flag_del: number
  id_offkeg: string
  id_offpegawai: any
  id_user: number
  jam_offkeg: string
  jam_offkeg2: string
  name_offpegawai: string
  name_bidang: string
  note_offkeg: string
  reply_note: string
  reply_state: string
  str_file: string
  tgl_data: string
  tgl_offkeg: string
  user_assign: string
  plt_bidang: any
  plt_bidangsub: any
}
