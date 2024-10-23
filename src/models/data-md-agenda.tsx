export interface ResponseDataMdAgenda {
  data: DataMdAgenda[]
  error: boolean
  id_bidang: number
  id_bidangsub: number
  pesan: string
}

export interface DataMdAgenda {
  comt_offagenda: string
  dispo_kegiatan: string
  flag_del: number
  id_bidang: number
  id_bidangsub: number
  id_dispo: number
  id_offagenda: number
  id_offpegawai: number
  id_ruangrapat: number
  id_user: string
  lokasi_kegiatan: string
  name_bidang: string
  name_bidangsub: string
  name_offagenda: string
  name_offpegawai: string
  name_ruangrapat: string
  str_fotoruangrapat: string
  tgl_data: Date
  tgl_kegiatan: Date
  waktu_kegiatan: number
  waktu_mulai: string
  waktu_selesai: string
}
