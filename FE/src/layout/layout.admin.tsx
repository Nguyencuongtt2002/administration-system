import { useAppDispatch, useAppSelector } from '@/utils/redux/hooks'
import AppHeader from './app.header'
import NavLinks from './nav-links'
import { RootState } from '@/utils/redux/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { StorageEnum } from '@/utils/enum/common'
import { authActions } from '@/thunks/auth/authSlice'
import { adminRoute } from '@/utils/routes/routes'

export default function LayoutAdmin({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = useAppSelector((state: RootState) => state.auth)

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <NavLinks />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <AppHeader userId={Number(user.user.MaNguoiDung)} />
        {children}
      </div>
    </div>
  )
}
