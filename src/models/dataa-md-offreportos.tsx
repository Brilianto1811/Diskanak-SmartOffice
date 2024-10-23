export interface ResponseDataMdReportos {
  data: DataMdReportos[]
  error: boolean
  pesan: string
}

export interface DataMdReportos {
  comt_offreportos: string
  flag_del: number
  id_offreportos: number
  id_user: string
  month_report: number
  name_offreportos: string
  tgl_data: any
  tgl_end: any
  tgl_end2: any
  tgl_start: any
  tgl_start2: any
  year_report: number
}
