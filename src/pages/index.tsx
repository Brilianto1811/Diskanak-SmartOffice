import { useEffect } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const CardWithCollapse = ({ sx }: { sx?: BoxProps['sx'] }) => {
  useEffect(() => {
    window.location.href = '/login'
  }, [])

  return (
    <>
      <Box
        className='content-center'
        sx={{
          backgroundImage: `linear-gradient(to bottom, rgba(166, 247, 123, 0.8), rgba(45, 189, 110, 0.8))`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center top',
          height: '100vh'
        }}
      >
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
      </Box>
    </>
  )
}

export default CardWithCollapse
