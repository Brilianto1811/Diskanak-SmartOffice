// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Menu'
    },
    {
      title: 'Dashboard',
      icon: 'tabler:chart-bar',
      path: '/asn/dashboard',
      id_jabatan: ['1', '2', '3', '4', '5', '6', '11']
    },
    {
      title: 'Dashboard',
      icon: 'tabler:chart-bar',
      path: '/nonasn/dashboard',
      id_jabatan: ['10', '11']
    },
    {
      title: 'Daftar Tugas',
      icon: 'tabler:clipboard-list',
      path: '/asn/daftar_tugas',
      id_jabatan: ['2', '3', '4', '5', '6', '11']
    },
    {
      title: 'Daftar Tugas',
      icon: 'tabler:clipboard-list',
      path: '/nonasn/daftar_tugas',
      id_jabatan: ['10', '11']
    },
    {
      title: 'Rutinitas',
      icon: 'tabler:list-check',
      path: '/asn/rutinitas',
      id_jabatan: ['2', '3', '4', '5', '6', '11']
    },
    {
      title: 'Rutinitas',
      icon: 'tabler:list-check',
      path: '/nonasn/rutinitas',
      id_jabatan: ['10', '11']
    },
    {
      title: 'Penugasan',
      icon: 'tabler:briefcase',
      path: '/asn/penugasan',
      id_jabatan: ['1', '2', '3', '4', '5', '11']
    },
    {
      title: 'Validasi',
      icon: 'tabler:checklist',
      path: '/asn/validasi',
      id_jabatan: ['1', '2', '3', '4', '5', '11']
    },
    {
      title: 'Agenda',
      icon: 'tabler:calendar-event',
      path: '/asn/agenda',
      id_jabatan: ['1', '2', '3', '4', '5', '6', '11']
    },
    {
      title: 'Agenda',
      icon: 'tabler:calendar-event',
      path: '/nonasn/agenda',
      id_jabatan: ['10', '11']
    },
    {
      title: 'Laporan Kinerja',
      icon: 'tabler:clipboard-text',
      path: '/nonasn/laporan_kinerja',
      id_jabatan: ['10', '11']
    },
    {
      title: 'Gallery Kegiatan',
      icon: 'tabler:photo',
      path: '/asn/gallery_rutinitas',
      id_jabatan: ['1', '2', '3', '4', '5', '6', '11']
    },
    {
      title: 'Gallery Kegiatan',
      icon: 'tabler:photo',
      path: '/nonasn/gallery_rutinitas',
      id_jabatan: ['10', '11']
    }
  ]
}

export default navigation
