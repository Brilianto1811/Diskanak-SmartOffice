// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import jwt_decode from 'jwt-decode'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { DataMdPegawai, ResponseDataMdPegawai } from 'src/models/data-md-pegawai'
import api, { baseURL } from 'src/utils/api'

import Cookies from 'js-cookie'
import usedecodetoken from 'src/utils/decodecookies'

interface Props {
  settings: Settings
}

let decodedToken: any
let id_offPegawai: string

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = (props: Props) => {
  const [dataById, setdataById] = useState<ResponseDataMdPegawai>({
    data: [],
    error: false,
    pesan: ''
  })
  const [dataOptionById, setdataOptionById] = useState<DataMdPegawai[]>()

  const [dataToken, setDataToken] = useState<string>('')
  useEffect(() => {
    const tokenData = localStorage.getItem('token')

    if (tokenData) {
      decodedToken = jwt_decode(tokenData)
      id_offPegawai = decodedToken.id_offpegawai.toString()
      setDataToken(id_offPegawai)
    } else {
    }
  }, [dataById])

  useEffect(() => {
    const fetchData = async () => {
      if (dataToken !== '') {
        try {
          const idpegawai = '/get-datamdpegawai/' + dataToken.toString()

          const response = await api.get<ResponseDataMdPegawai>(idpegawai)
          setdataById(response.data)
          const tmpdata = response.data.data.filter(data => {
            return data.str_foto
          })

          setdataOptionById(tmpdata)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchData()
  }, [dataToken])

  const [isasn, setIsasn] = useState<string>('')

  useEffect(() => {
    const decodedtoken = usedecodetoken()

    if (decodedtoken?.id_jabatan >= 1 && decodedtoken?.id_jabatan <= 6) {
      setIsasn('asn')
    } else {
      setIsasn('nonasn')
    }
  }, [])

  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    Cookies.remove('token')
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {/* {dataToken} */}
        <Avatar
          src={
            dataOptionById && dataOptionById.length > 0
              ? `${baseURL}/detailpict/:?file=` + dataOptionById[0].str_foto
              : '/images/diskominfo/user2.png'
          }
          onClick={handleDropdownOpen}
          sx={{ width: 38, height: 38 }}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar
                src={
                  dataOptionById && dataOptionById.length > 0
                    ? `${baseURL}/detailpict/:?file=` + dataOptionById[0].str_foto
                    : '/images/diskominfo/user2.png'
                }
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>
                {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].alias_offpegawai : '-'}
              </Typography>
              <Typography variant='body2'>
                {dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_jabatan : '-'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: (theme: { spacing: (arg0: number) => any }) => `${theme.spacing(2)} !important` }} />

        <MenuItemStyled
          sx={{ p: 0 }}
          onClick={() => handleDropdownClose(`/${isasn}/dashboard/profile-akun/TabAccount`)}
        >
          <Box sx={styles}>
            <Icon icon='tabler:user-check' />
            My Profile
          </Box>
        </MenuItemStyled>

        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Sign Out
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
