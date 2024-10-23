import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ display: 'flex', color: 'text.secondary', justifyContent: 'center' }}>
        {`© 2024 APTIKA Dinas Komunikasi dan Informatika Kabupaten Bogor`}
      </Typography>
    </Box>
  )
}

export default FooterContent
