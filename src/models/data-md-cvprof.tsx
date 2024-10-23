export interface ResponseDataMdCVProf {
  data: DataMdCVProf[]
  error: boolean
  id_bidang: number
  id_bidangsub: number
  pesan: string
}

export interface DataMdCVProf {
  flag_del: any
  id_cvprof: any
  id_offpegawai: any
  id_user: any
  jum_jobs: any
  jum_skill: any
  name_offpegawai: string
  peg_add: any
  peg_agama: any
  peg_dik: any
  peg_kel: any
  peg_mail: any
  peg_name: any
  peg_nik: any
  peg_passion: any
  peg_phone: any
  peg_status: any
  tgl_data: any
  tgl_lahir: any
  tmp_lahir: any
}
