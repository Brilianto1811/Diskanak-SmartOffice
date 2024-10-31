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
        className="content-right"
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(/images/diskominfo/depandiskanak.jpg)`,
          backgroundPosition: 'center',
          color: 'white',
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
            src={'/images/diskominfo/logoutama.png'}
            alt='Logo'
            width={'225'}
            height={'150'}
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
