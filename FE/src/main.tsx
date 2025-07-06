import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Provider } from 'react-redux'
import { persistor, store } from './utils/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import '@/i18n/i18n'
import { Toaster } from '@/components/ui/sonner'
import useRouteElements from './utils/routes/useRouteElements'
import { LoadingDataProvider } from './components/common'

const routeElements = useRouteElements()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <LoadingDataProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={routeElements} />
          </PersistGate>
        </Provider>
      </LoadingDataProvider>
      <Toaster
        toastOptions={{
          className: 'max-w-fit px-4 py-2 text-sm rounded-lg shadow-md'
        }}
      />
    </ThemeProvider>
  </StrictMode>
)
