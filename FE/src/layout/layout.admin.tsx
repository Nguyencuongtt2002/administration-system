import React from 'react'
import AppHeader from './app.header'
import NavLinks from './nav-links'

function LayoutAdminComponent({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <NavLinks />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <AppHeader />
        <React.Suspense>{children}</React.Suspense>
      </div>
    </div>
  )
}

const LayoutAdmin = React.memo(LayoutAdminComponent)

export default LayoutAdmin
