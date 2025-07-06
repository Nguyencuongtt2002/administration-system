import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/utils/redux/hooks'
import { authActions } from '@/thunks/auth/authSlice'
import { adminRoute } from '@/utils/routes/routes'
import { httpInstance } from '@/apis/axios.customize'

export default function GoogleCallback() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const errorMessage = searchParams.get('errorMessage')

    if (accessToken && refreshToken) {
      httpInstance.setAccessToken(accessToken)
      httpInstance.setRefreshToken(refreshToken)
      dispatch(authActions.setAccessToken(accessToken))
      dispatch(authActions.setRefreshToken(refreshToken))
      dispatch(authActions.setIsAuthenticated(true))
      setTimeout(() => {
        navigate(`${adminRoute.base}/${adminRoute.dashboard}`)
      }, 1000)
    } else {
      setError(errorMessage ?? 'Something went wrong with Google authentication')
    }
  }, [location])

  return error ? (
    <div className='text-red-500 p-4'>{error}</div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <span className='w-12 h-12 inline-block box-border animate-spin rounded-full border-4 border-picton-blue-500 border-b-transparent border-solid'></span>
    </div>
  )
}
