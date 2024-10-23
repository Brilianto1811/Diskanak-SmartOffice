export interface ResponseDataMdPegawai {
  data: DataMdPegawai[]
  error: boolean
  pesan: string
}

export interface DataMdPegawai {
  alias_offpegawai: string
  comt_user: string
  flag_del: number
  id_bidang: number
  id_bidangsub: number
  id_golongan: number
  id_instansi: number
  id_jabatan: number
  id_offpegawai: number
  id_user: number
  name_bidang: string
  name_bidangsub: string
  name_golongan: string
  name_instansi: string
  name_jabatan: string
  name_offpegawai: string
  nip_offpegawai: string
  str_foto: any
  str_pswd: null | string
  tgl_data: Date
  plt_bidang: any
  plt_bidangsub: any
  cc_112: number
  no_telp: string
}
