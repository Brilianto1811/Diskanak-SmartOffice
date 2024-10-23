export interface ResponseDataMdPenerimaTask {
  data: DataMdPenerimaTask[]
  error: boolean
  pesan: string
}

export interface DataMdPenerimaTask {
  user_assign: any
  tgl_offtask: string
  jam_offtask: any
  id_penerimatask: any
  id_userassign: any
  id_offpegawai: any
  id_offtask: any
  code_assign: string
  cap_offtask: string
  note_offtask: string
  reply_note: string
  progres: any
  str_file: any
  tgl_taskselesai: any
  tgl_data: any
  reply_state: any
}
