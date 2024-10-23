import Grid from '@mui/material/Grid'
import Dashboard from 'src/components/dashboard'

const Gallery = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Dashboard />
      </Grid>
    </Grid>
  )
}

export default Gallery
