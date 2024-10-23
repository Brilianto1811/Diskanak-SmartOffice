import Grid from '@mui/material/Grid'
import TabAccount from 'src/components/profile'

const ProfileAkun = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabAccount />
      </Grid>
    </Grid>
  )
}

export default ProfileAkun
