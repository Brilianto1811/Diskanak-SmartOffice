// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img
        src={'/images/diskominfo/Lambang_Kabupaten_Bogor.png'}
        alt='Logo'
        width={'138'}
        height={'170'}
        style={{
          display: 'block',
          margin: '0 auto',
          textAlign: 'center',
          verticalAlign: 'middle'
        }}
      />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
