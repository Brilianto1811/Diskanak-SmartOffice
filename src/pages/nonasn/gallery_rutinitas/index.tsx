import Grid from '@mui/material/Grid'
import GalleryKegiatan from 'src/components/gallery'

const Gallery = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GalleryKegiatan />
      </Grid>
    </Grid>
  )
}

export default Gallery
