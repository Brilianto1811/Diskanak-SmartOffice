import Grid from '@mui/material/Grid'
import TablePenugasan from 'src/components/penugasan'

const Penugasan = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ pb: 4 }}>
        <TablePenugasan />
      </Grid>
    </Grid>
  )
}

export default Penugasan
