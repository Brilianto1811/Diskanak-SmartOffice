import Grid from '@mui/material/Grid'
import TableValidasi from 'src/components/validasi'

const Validasi = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TableValidasi />
      </Grid>
    </Grid>
  )
}

export default Validasi
