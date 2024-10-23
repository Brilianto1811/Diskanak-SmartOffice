import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt_decode from 'jwt-decode'

export function middleware(request: NextRequest) {
  const urlAdmin = [
    '/asn/dashboard/',
    '/asn/profile/',
    '/asn/update_profile/',
    '/asn/agenda/',
    '/asn/daftar_tugas/',
    '/asn/daftar_tugas_laporan/',
    '/asn/dashboard/profile-akun/TabAccount/',
    '/asn/penilaian/',
    '/asn/penugasan/',
    '/asn/tambah_tugas/',
    '/asn/rutinitas/',
    '/asn/validasi/',
    '/asn/gallery_rutinitas/',
    '/nonasn/dashboard/',
    '/nonasn/profile/',
    '/nonasn/update_profile/',
    '/nonasn/daftar_tugas/',
    '/nonasn/daftar_tugas_laporan/',
    '/nonasn/rutinitas/',
    '/nonasn/laporan_kinerja/',
    '/nonasn/cetak_cv/',
    '/nonasn/ruang_rapat/',
    '/nonasn/gallery_rutinitas/',
    '/nonasn/dashboard/profile-akun/TabAccount/'
  ]
  const urlKepalaDinas = [
    '/asn/dashboard/',
    '/asn/dashboard/profile-akun/TabAccount/',
    '/asn/profile/',
    '/asn/update_profile/',
    '/asn/agenda/',
    '/asn/penugasan/',
    '/asn/validasi/',
    '/asn/gallery_rutinitas/'
  ]
  const urlSekdinKabidKasie = [
    '/asn/dashboard/',
    '/asn/dashboard/profile-akun/TabAccount/',
    '/asn/profile/',
    '/asn/update_profile/',
    '/asn/agenda/',
    '/asn/daftar_tugas/',
    '/asn/daftar_tugas_laporan/',
    '/asn/penilaian/',
    '/asn/penugasan/',
    '/asn/tambah_tugas/',
    '/asn/rutinitas/gallery_rutinitas/',
    '/asn/rutinitas/',
    '/asn/validasi/',
    '/asn/gallery_rutinitas/'
  ]
  const urlFungsionalStaffASN = [
    '/asn/dashboard/',
    '/asn/dashboard/profile-akun/TabAccount/',
    '/asn/profile/',
    '/asn/update_profile/',
    '/asn/agenda/',
    '/asn/daftar_tugas/',
    '/asn/daftar_tugas_laporan/',
    '/asn/rutinitas/',
    '/asn/ruang_rapat/',
    '/asn/gallery_rutinitas/'
  ]
  const urlNonASN = [
    '/nonasn/dashboard/',
    '/nonasn/profile/',
    '/nonasn/dashboard/profile-akun/TabAccount/',
    '/nonasn/update_profile/',
    '/nonasn/daftar_tugas/',
    '/nonasn/daftar_tugas_laporan/',
    '/nonasn/rutinitas/',
    '/nonasn/laporan_kinerja/',
    '/nonasn/cetak_cv/',
    '/nonasn/ruang_rapat/',
    '/nonasn/agenda/',
    '/nonasn/gallery_rutinitas/'
  ]

  const exclude = ['images', 'static', '_next', 'locales']
  try {
    if (exclude.some(excludePath => request.url.includes(excludePath))) {
      return NextResponse.next()
    }
    const token = request.cookies.get('token')
    const decodeToken: any = token?.value ? jwt_decode(token.value) : null
    const { id_jabatan } = decodeToken
    console.log(
      id_jabatan,
      request.nextUrl.pathname,
      urlNonASN.includes(request.nextUrl.pathname) && id_jabatan.toString() !== '1'
    )
    let gagal = true
    let isacc = false
    if (urlKepalaDinas.includes(request.nextUrl.pathname) && id_jabatan.toString() === '1') {
      isacc = true
      gagal = false
    } else if (urlSekdinKabidKasie.includes(request.nextUrl.pathname) && id_jabatan.toString() === '2') {
      isacc = true
      gagal = false
    } else if (urlSekdinKabidKasie.includes(request.nextUrl.pathname) && id_jabatan.toString() === '3') {
      isacc = true
      gagal = false
    } else if (urlSekdinKabidKasie.includes(request.nextUrl.pathname) && id_jabatan.toString() === '4') {
      isacc = true
      gagal = false
    } else if (urlSekdinKabidKasie.includes(request.nextUrl.pathname) && id_jabatan.toString() === '5') {
      isacc = true
      gagal = false
    } else if (urlFungsionalStaffASN.includes(request.nextUrl.pathname) && id_jabatan.toString() === '6') {
      isacc = true
      gagal = false
    } else if (urlNonASN.includes(request.nextUrl.pathname) && id_jabatan.toString() === '10') {
      isacc = true
      gagal = false
    }
    if (gagal && !isacc) {
      // jika homepag
      if (['/', ''].includes(request.nextUrl.pathname)) {
        return NextResponse.next()
      }
      console.log('masuk ke gagal', request.url, request.nextUrl.origin)
      if (!request.url.includes('login')) {
        return NextResponse.redirect(request.nextUrl.origin + '/login/')
      }
    }
    console.log('aman')

    return NextResponse.next()
  } catch (e) {
    console.log('masuk ke catch')
    if (urlAdmin.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(request.nextUrl.origin + '/login')
    }
  }
}
