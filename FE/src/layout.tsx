import { Outlet } from 'react-router-dom'
import LayoutAdmin from './layout/layout.admin'

function Layout() {
  return (
    <LayoutAdmin>
      <Outlet />
    </LayoutAdmin>
  )
}

export default Layout
