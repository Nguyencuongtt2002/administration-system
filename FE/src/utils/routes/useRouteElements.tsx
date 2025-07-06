import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/utils/redux/hooks'
import { adminRoute } from './routes'
import Layout from '@/layout'
import {
  AboutPage,
  AdminDashboard,
  BrandPage,
  CategoryPage,
  ContactPage,
  GoogleCallback,
  LoginForm,
  MenuPage,
  MessagePage,
  RegisterPage,
  SlidePage,
  VerifyPage
} from '@/pages'

function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElements = () => {
  const routeElements = createBrowserRouter([
    {
      path: '/auth/callback',
      element: <GoogleCallback />
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            {
              index: true,
              element: <AdminDashboard />
            },
            {
              path: `${adminRoute.base}/${adminRoute.dashboard}`,
              element: <AdminDashboard />
            },
            {
              path: `${adminRoute.base}/${adminRoute.category}`,
              element: <CategoryPage />
            },
            {
              path: `${adminRoute.base}/${adminRoute.brand}`,
              element: <BrandPage />
            },
            {
              path: `${adminRoute.base}/${adminRoute.contact}`,
              element: <ContactPage />
            },
            {
              path: `${adminRoute.base}/${adminRoute.menu}`,
              element: <MenuPage />
            },
            {
              path: `${adminRoute.base}/${adminRoute.message}`,
              element: <MessagePage />
            },
            {
              path: `${adminRoute.base}/${adminRoute.about}`,
              element: <AboutPage />
            },
            {
              path: `${adminRoute.base}/${adminRoute.slide}`,
              element: <SlidePage />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <RejectedRoute />,
      children: [
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: 'login',
          element: <LoginForm />
        },
        {
          path: 'verify/:id',
          element: <VerifyPage />
        }
      ]
    }
  ])
  return routeElements
}

export default useRouteElements
