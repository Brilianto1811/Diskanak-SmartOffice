import { useState, ElementType, useEffect, SyntheticEvent, Fragment } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'

import CustomTextField from 'src/@core/components/mui/text-field'

import { useForm, Controller } from 'react-hook-form'
import api, { baseURL } from 'src/utils/api'
import { DataMdPegawai, ResponseDataMdPegawai } from 'src/models/data-md-pegawai'
import jwt_decode from 'jwt-decode'
import { GetPegawai, UpdateDataPegawai, UpdateFotoPegawai } from 'src/store/module-pegawai'
import usedecodetoken from 'src/utils/decodecookies'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from 'src/@core/components/icon'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Avatar, List, ListItem, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import React from 'react'
import IconButton from '@mui/material/IconButton'

interface FileProp {
  name: string
  type: string
  size: number
}

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

interface State {
  showNewPassword: boolean
  showConfirmNewPassword: boolean
}

const defaultValues = {
  newPassword: '',
  confirmNewPassword: ''
}

const schema = yup.object().shape({
  newPassword: yup.string().required(),
  confirmNewPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

let decodedToken: any
let id_offPegawai: string

const TabAccount = () => {
  const [dataOptionById, setdataOptionById] = useState<DataMdPegawai[]>()
  const [data, setData] = useState<any[]>([])
  const [value, setValue] = useState<string>('1')
  const [selectedData, setSelectedData] = useState<any>()
  const [files, setFiles] = useState<File[]>([])
  const [open, setOpen] = React.useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 2000000,
    accept: {
      '/*': ['.']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      if (acceptedFiles.length > 0) {
        setSelectedData(acceptedFiles[0])
      }
    },
    onDropRejected: () => {
      notifywarning('You can only upload 1 files & maximum size of 2 MB.')
    }
  })

  const handleUpdatePhoto = async () => {
    console.log('handleUpdatePhoto called', selectedData)
    const decodedtoken = usedecodetoken()

    if (!selectedData) return

    const id_offpegawai = decodedtoken?.id_offpegawai

    const bodyFormData = new FormData()

    bodyFormData.append('id_offpegawai', id_offpegawai)

    if (files.length > 0) {
      files.forEach(file => {
        bodyFormData.append(`str_foto`, file)
      })
    }
    try {
      await UpdateFotoPegawai(bodyFormData)
      handleClose()
      notifysuccess('Sukses Update Data !')
      await GetDataPegawai()
      window.location.reload()
    } catch (ex: any) {
      // notifyerror(ex.response.data.pesan)
      // Handle the error
      // console.error(ex)
    }
  }

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='fa6-regular:file-lines' width='50' height='50' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? (Math.round(file.size / 100) / 10000).toFixed(1) + ' MB'
              : (Math.round(file.size / 100) / 10).toFixed(1) + ' kb'}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='ph:x-circle-light' width='30' height='30' />
      </IconButton>
    </ListItem>
  ))

  const notifysuccess = (msg: any) => {
    toast.success(msg, {
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

  const [dataById, setdataById] = useState<ResponseDataMdPegawai>({
    data: [],
    error: false,
    pesan: ''
  })

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const GetDataPegawai = async () => {
    try {
      const responseData = await GetPegawai()
      const tmpData = responseData.data.map(val => ({ ...val, id: val.id_offpegawai }))
      const tmpdata2 = responseData.data.filter(data => {
        return String(data.id_offpegawai) == String(dataToken)
      })
      setData(tmpData)
      setdataOptionById(tmpdata2)
      console.log(responseData)
    } catch (error) {
      console.error(error)
    }
  }

  const [dataToken, setDataToken] = useState<string>('')
  useEffect(() => {
    const tokenData = localStorage.getItem('token')

    if (tokenData) {
      decodedToken = jwt_decode(tokenData)
      id_offPegawai = decodedToken.id_offpegawai.toString()
      setDataToken(id_offPegawai)
    } else {
    }
  }, [dataById, data])

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

    fetchData(), GetDataPegawai()
  }, [dataToken])

  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showConfirmNewPassword: false
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const onPasswordFormSubmit = async ({ newPassword }: { newPassword: string }) => {
    const decodedtoken = usedecodetoken()

    try {
      if (decodedtoken) {
        const response = await UpdateDataPegawai(decodedtoken.id_offpegawai, newPassword)
        notifysuccess(response.pesan)
        reset()
        GetDataPegawai()
      } else {
        notifyerror('Unable to get user information')
      }
    } catch (ex: any) {
      console.error(ex)
      notifyerror('An error occurred while updating password')
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='customized tabs example'>
              <Tab value='1' label='Profile Details' />
              <Tab value='2' label='Ganti Password' />
            </TabList>
            <TabPanel value='1'>
              <Card style={{ marginTop: '5px', marginLeft: '-23px', padding: '20px', width: '104%' }}>
                <CardHeader title='Profile Details' />
                <form>
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={
                          dataOptionById && dataOptionById.length > 0
                            ? `${baseURL}/detailpict/:?file=` + dataOptionById[0].str_foto
                            : '/images/diskominfo/user2.png'
                        }
                        sx={{ width: 150, height: 150, marginRight: 5 }}
                      />
                      <div>
                        <ButtonStyled
                          variant='contained'
                          sx={{ backgroundColor: 'orange', color: 'white' }}
                          onClick={() => {
                            setOpen(true)
                          }}
                        >
                          Update Photo
                        </ButtonStyled>
                      </div>
                    </Box>
                  </CardContent>
                </form>
                <Divider />
                <CardContent>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Nama'
                        placeholder={
                          dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_offpegawai : '-'
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Alias'
                        placeholder={
                          dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].alias_offpegawai : '-'
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='NIP'
                        placeholder={
                          dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].nip_offpegawai : '-'
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Jabatan'
                        placeholder={dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_jabatan : '-'}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Bidang'
                        placeholder={dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_bidang : '-'}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Sub Bidang'
                        placeholder={
                          dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_bidangsub : '-'
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Golongan'
                        placeholder={
                          dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_golongan : '-'
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label='Instansi'
                        placeholder={
                          dataOptionById && dataOptionById.length > 0 ? dataOptionById[0].name_instansi : '-'
                        }
                        disabled
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                  <Fragment>
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input
                        value={selectedData?.namaFileFoto}
                        {...getInputProps()}
                        onChange={e => console.log(e.target.value)}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          textAlign: 'center',
                          alignItems: 'center',
                          width: '530px',
                          flexDirection: 'column',
                          paddingTop: '20px',
                          paddingBottom: '20px',
                          borderRadius: '10px',
                          border: '2px dashed rgba(0, 0, 0, 0.29)'
                        }}
                      >
                        <Box
                          sx={{
                            mb: 8.75,
                            width: 48,
                            height: 48,
                            display: 'flex',
                            borderRadius: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                          }}
                        >
                          <Icon icon='tabler:upload' fontSize='1.75rem' />
                        </Box>
                        <Typography variant='h4' sx={{ mb: 2.5 }}>
                          Drop files here or click to upload.
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>Max 1 files and max size of 2 MB</Typography>
                      </Box>
                    </div>
                    {files.length ? (
                      <Fragment>
                        <List>{fileList}</List>
                        <div className='buttons'></div>
                      </Fragment>
                    ) : null}
                  </Fragment>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleUpdatePhoto}>Upload</Button>
                </DialogActions>
              </Dialog>
            </TabPanel>
            <TabPanel value='2'>
              <Card style={{ marginTop: '5px', marginLeft: '-23px', padding: '20px', width: '104%' }}>
                <CardHeader title='Change Password' />
                <CardContent>
                  <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
                    <Grid container spacing={5}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name='newPassword'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              value={value}
                              onChange={onChange}
                              label='New Password'
                              id='input-new-password'
                              placeholder='············'
                              error={Boolean(errors.newPassword)}
                              type={values.showNewPassword ? 'text' : 'password'}
                              {...(errors.newPassword && { helperText: errors.newPassword.message })}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      edge='end'
                                      onClick={handleClickShowNewPassword}
                                      onMouseDown={e => e.preventDefault()}
                                    >
                                      <Icon
                                        fontSize='1.25rem'
                                        icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                      />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name='confirmNewPassword'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              value={value}
                              onChange={onChange}
                              placeholder='············'
                              label='Confirm New Password'
                              id='input-confirm-new-password'
                              error={Boolean(errors.confirmNewPassword)}
                              type={values.showConfirmNewPassword ? 'text' : 'password'}
                              {...(errors.confirmNewPassword && { helperText: errors.confirmNewPassword.message })}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      edge='end'
                                      onMouseDown={e => e.preventDefault()}
                                      onClick={handleClickShowConfirmNewPassword}
                                    >
                                      <Icon
                                        fontSize='1.25rem'
                                        icon={values.showConfirmNewPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                      />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={5} sx={{ mt: 0 }}>
                      {/*  */}

                      <Grid item xs={12}>
                        <Button variant='contained' type='submit' sx={{ mr: 4 }}>
                          Save Changes
                        </Button>
                        <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                          Reset
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default TabAccount
