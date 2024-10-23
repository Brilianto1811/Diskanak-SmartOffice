import Grid from '@mui/material/Grid'
import TableRutinitas from 'src/components/rutinitas'

const Rutinitas = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <TableRutinitas />
      </Grid>
    </Grid>
  )
}

export default Rutinitas
