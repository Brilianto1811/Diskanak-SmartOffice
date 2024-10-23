import Grid from '@mui/material/Grid'
import 'react-toastify/dist/ReactToastify.css'
import CardDaftarTugas from 'src/components/daftar_tugas'

const DaftarTugas = () => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <CardDaftarTugas />
      </Grid>
    </Grid>
  )
}

export default DaftarTugas
