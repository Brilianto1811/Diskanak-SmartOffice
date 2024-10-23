export interface ResponseDataMdStatistik {
  data: DataMdStatistik[]
  error: boolean
  pesan: string
}

export interface DataMdStatistik {
  name_bidang: string
  jumlah_orang: number
  comt_bidang: any
}
