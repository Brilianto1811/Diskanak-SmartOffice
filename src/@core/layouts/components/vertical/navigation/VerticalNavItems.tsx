// ** Type Imports
import { NavLink, NavGroup, LayoutProps, NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavGroup from './VerticalNavGroup'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'
import { useEffect, useState } from 'react'
import usedecodetoken from 'src/utils/decodecookies'

interface Props {
  parent?: NavGroup
  navHover?: boolean
  navVisible?: boolean
  groupActive: string[]
  isSubToSub?: NavGroup
  currentActiveGroup: string[]
  navigationBorderWidth: number
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
  verticalNavItems?: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
}

const resolveNavItemComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  // console.log(item)
  if ((item as NavSectionTitle).sectionTitle) return VerticalNavSectionTitle
  if ((item as NavGroup).children) return VerticalNavGroup

  return VerticalNavLink
}

const VerticalNavItems = (props: Props) => {
  const { verticalNavItems } = props

  // State untuk menyimpan item-menu yang akan ditampilkan
  const [filteredNavItems, setFilteredNavItems] = useState<any>([])

  useEffect(() => {
    const decodedtoken = usedecodetoken()

    // Filter item-menu sesuai dengan id_jabatan
    const filteredItems = verticalNavItems?.filter(
      (item: any) => item.id_jabatan && item.id_jabatan.includes(decodedtoken?.id_jabatan)
    )

    setFilteredNavItems(filteredItems)
  }, [verticalNavItems]) // pastikan untuk menyertakan verticalNavItems dalam dependencies agar efek samping diterapkan saat berubah

  const RenderMenuItems = filteredNavItems.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    const TagName: any = resolveNavItemComponent(item)

    return <TagName {...props} key={index} item={item} />
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems
