import { RoleEnum } from '@/utils/enum/common'
import { IMenuItem } from '@/utils/interface/common'
import { adminRoute } from '@/utils/routes/routes'
import { Home, ShoppingCart, LayoutGrid, Tags, Phone, BookOpen, Info, BookText, FileSliders, Ruler } from 'lucide-react'

const menuItems: IMenuItem[] = [
  {
    title: 'common_sidebar_dashboard',
    Icon: Home,
    href: `${adminRoute.base}/${adminRoute.dashboard}`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_category',
    Icon: LayoutGrid,
    href: `${adminRoute.base}/${adminRoute.category}`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_brand',
    Icon: Tags,
    href: `${adminRoute.base}/${adminRoute.brand}`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_menu',
    Icon: BookOpen,
    href: `${adminRoute.base}/${adminRoute.menu}`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_contact',
    Icon: Phone,
    href: `${adminRoute.base}/${adminRoute.contact}`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_orders',
    Icon: ShoppingCart,
    href: '/manage/orders',
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_about',
    Icon: BookText,
    href: `${adminRoute.base}/about`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_slide',
    Icon: FileSliders,
    href: `${adminRoute.base}/${adminRoute.slide}`,
    roles: [RoleEnum.ADMIN]
  },
  {
    title: 'common_sidebar_size',
    Icon: Ruler,
    href: `${adminRoute.base}/${adminRoute.size}`,
    roles: [RoleEnum.ADMIN]
  }
]

export default menuItems
