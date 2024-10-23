import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'

const usedecodetoken = () => {
  const token = Cookies.get('token')
  const decodeToken: any = token ? jwt_decode(token) : null

  if (decodeToken) {
    const { id_jabatan, id_bidang, id_bidangsub, id_offpegawai, plt_bidang, plt_bidangsub, cc_112 } = decodeToken

    return {
      id_jabatan,
      id_bidang,
      id_bidangsub,
      id_offpegawai,
      plt_bidang,
      plt_bidangsub,
      cc_112
    }
  }

  return null
}

export default usedecodetoken
