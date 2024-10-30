'use client'
import { useState, ReactNode, useEffect } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Autocomplete, TextField } from '@mui/material'
import { ResponseDataMdPegawai, DataMdPegawai } from 'src/models/data-md-pegawai'

import api from 'src/utils/api'

import Cookies from 'js-cookie'
import ReCAPTCHA from 'react-google-recaptcha'
import usedecodetoken from 'src/utils/decodecookies'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SubmitHandler } from 'react-hook-form'

import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

const schema = yup.object().shape({
  password: yup.string().required()
})

interface FormData {
  password: string
}

const LoginPage = () => {
  const notifysuccess = (msg: any) => {
    toast.success(msg, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const notifywarning = (msg: any) => {
    toast.warn(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const notifyerror = (msg: any) => {
    toast.error(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Zoom,
      theme: 'light'
    })
  }

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [dataLogin, setDataLogin] = useState<ResponseDataMdPegawai>({
    data: [],
    error: false,
    pesan: ''
  })
  const [dataOptionLogin, setDataOptionLogin] = useState<DataMdPegawai[]>([])
  const [selectedOptionAsn, setSelectedOptionAsn] = useState<DataMdPegawai | null>()
  const [selectedOptionNonAsn, setSelectedOptionNonAsn] = useState<DataMdPegawai | null>()
  const [captchaVerified, setCaptchaVerified] = useState(false)

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true)
    } else {
      notifywarning('Harap centang kotak CAPTCHA sebelum melanjutkan.')
      setCaptchaVerified(false)
    }
  }

  const initFirst = async () => {
    const response = await api.get<ResponseDataMdPegawai>('/get-datamdpegawailogin')
    setDataLogin(response.data)
    const tmpdata = response.data.data.filter(data => {
      if (isasn) {
        return data.id_jabatan <= 6
      } else {
        return data.id_jabatan > 6
      }
    })
    setDataOptionLogin(tmpdata)
  }

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

  useEffect(() => {
    initFirst()
  }, [])

  const [isasn, setIsasn] = useState(true)

  useEffect(() => {
    const tmpdata = dataLogin.data.filter(data => {
      if (isasn) {
        return data.id_jabatan <= 6
      } else {
        return data.id_jabatan > 6
      }
    })
    setDataOptionLogin(tmpdata)

    if (!isasn && !selectedOptionNonAsn) {
      setSelectedOptionNonAsn(tmpdata[0] || null)
    }

    if (isasn && !selectedOptionAsn) {
      setSelectedOptionAsn(tmpdata[0] || null)
    }
  }, [isasn, dataLogin.data])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<FormData> = async data => {
    if (!captchaVerified) {
      notifywarning('Harap centang kotak CAPTCHA sebelum melanjutkan.')

      return
    }
    const form_password = data.password
    const form_id_offpegawai = isasn ? selectedOptionAsn?.id_offpegawai : selectedOptionNonAsn?.id_offpegawai
    const payload = {
      str_pswd: form_password,
      id_offpegawai: form_id_offpegawai
    }
    try {
      const response = await api.post(`/login`, payload)
      const token = response.data.data
      localStorage.setItem('token', JSON.stringify(response.data.data))
      Cookies.set('token', token, { expires: 1 })
      notifysuccess(response.data.pesan)
      console.log('ini token', token)

      const decodedtoken = usedecodetoken()

      if (decodedtoken?.id_jabatan >= 1 && decodedtoken?.id_jabatan <= 6) {
        // Redirect to /asn/dashboard page
        window.location.href = '/asn/dashboard'
      } else {
        // Redirect to /nonasn/dashboard page
        window.location.href = '/nonasn/dashboard'
      }
    } catch (error: any) {
      notifyerror('Password tidak valid !')
    }
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
           <LoginIllustration alt='login-illustration' src={`/images/diskominfo/logodiskanak.png`} sx={{height: '100%' }}/>
          {/* <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}-${theme.palette.mode}.png`} /> */}
        </Box>
      ) : null}
      <Box
        sx={{
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#EEEBE3',
          borderRadius: '20px'
        }}
      >
        <Box sx={{ mt: 5 }}>
          <img
            src={'/images/diskominfo/logodiskanak.png'}
            alt='Logo'
            width={'200'}
            style={{
              maxWidth: '100%',
              maxHeight: '100vh',
              display: 'block',
              margin: '0 auto',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          />
          <img
            src={'/images/diskominfo/textlogosimpeg.png'}
            alt='Logo'
            width={'320'}
            style={{
              display: 'block',
              marginBottom: '20px',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          />
        </Box>
        {/* <Box>
          <Typography
            variant='h1'
            sx={{ mb: 1.5, textAlign: 'center', color: 'black', fontSize: '20px', marginTop: '5px' }}
          >
            {`Login Sebagai`}
          </Typography>
        </Box> */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            variant='contained'
            color={isasn ? 'success' : 'secondary'}
            sx={{
              height: '40px',
              width: '150px',
              marginRight: '15px',
              borderRadius: 2
            }}
            onClick={() => {
              setIsasn(true)
            }}
          >
            ASN
          </Button>
          <Button
            variant='contained'
            color={!isasn ? 'success' : 'secondary'}
            sx={{
              height: '40px',
              width: '150px',
              marginLeft: '15px',
              borderRadius: 2
            }}
            onClick={() => {
              setIsasn(false)
            }}
          >
            NON ASN
          </Button>
        </Box>

        <Box
          className='demo-space-x'
          sx={{ display: 'flex', flexWrap: 'wrap', mb: 4, marginTop: '5px', marginLeft: '15px' }}
        >
          <Autocomplete
            sx={{ width: 325 }}
            options={dataOptionLogin}
            id='autocomplete-outlined'
            getOptionLabel={option => option.name_offpegawai || ''}
            value={isasn ? selectedOptionAsn : selectedOptionNonAsn}
            onChange={(event: any, newValue: DataMdPegawai | null) => {
              if (isasn) {
                setSelectedOptionAsn(newValue)
              } else {
                setSelectedOptionNonAsn(newValue)
              }
            }}
            renderInput={params => <TextField {...params} label='-- Pilih Pegawai --' />}
          />
        </Box>

        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 1.5 }}>
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  onBlur={onBlur}
                  label='Password'
                  onChange={onChange}
                  id='auth-login-v2-password'
                  placeholder='Password'
                  error={Boolean(errors.password)}
                  {...(errors.password && { helperText: errors.password.message })}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ width: 325 }}>
            <ReCAPTCHA sitekey='6LcqlQApAAAAAG8L-MgTHY9xmuTF8BQABAad5pFv' onChange={handleCaptchaChange} />
            {/* 6LdyUkEpAAAAAALiZ4K_dMeY1Kgcfd4ygghzgU6M */}
            <Button
              fullWidth
              type='submit'
              variant='contained'
              sx={{
                backgroundColor: '#2DBD6E',
                color: 'white',
                mb: 5,
                mt: 5
              }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
