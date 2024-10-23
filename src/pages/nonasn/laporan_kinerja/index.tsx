import Grid from '@mui/material/Grid'
import LaporanKinerja from 'src/components/laporan_kinerja'

const Laporan = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LaporanKinerja />
      </Grid>
    </Grid>
  )
}

export default Laporan
