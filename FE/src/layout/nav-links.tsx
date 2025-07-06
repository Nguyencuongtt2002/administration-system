import { useAppSelector } from '@/utils/redux/hooks'
import menuItems from './menuItems'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Package2, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RootState } from '@/utils/redux/store'
import { RoleEnum } from '@/utils/enum/common'

export default function NavLinks() {
  const { t } = useTranslation()
  const userRole = useAppSelector((state: RootState) => state.auth.user.VaiTro)
  return (
    <TooltipProvider>
      <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
        <nav className='flex flex-col items-center gap-4 px-2 py-4'>
          {/* Logo */}
          <a
            href='/'
            className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
          >
            <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
            <span className='sr-only'>Big Boy Restaurant</span>
          </a>

          {menuItems
            .filter((item) => item.roles.includes(userRole as RoleEnum))
            .map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className='flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 text-muted-foreground'
                  >
                    <item.Icon className='h-5 w-5' />
                    <span className='sr-only'>{t(item.title as any)}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>{t(item.title as any)}</TooltipContent>
              </Tooltip>
            ))}
        </nav>

        <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href='/manage/setting'
                className='flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 text-muted-foreground'
              >
                <Settings className='h-5 w-5' />
                <span className='sr-only'>Cài đặt</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side='right'>Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  )
}
