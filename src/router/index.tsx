import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const Home       = lazy(() => import('@/pages/home/Home'))
const PayForm    = lazy(() => import('@/pages/payment/PayForm'))
const PayConfirm = lazy(() => import('@/pages/payment/PayConfirm'))
const PayResult  = lazy(() => import('@/pages/payment/PayResult'))
const RecordList = lazy(() => import('@/pages/record/RecordList'))
const Profile    = lazy(() => import('@/pages/profile/Profile'))

const PageFallback = (
  <div className="flex-center" style={{ height: '100dvh', color: 'var(--color-text-tertiary)' }}>
    加载中...
  </div>
)

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={PageFallback}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      { path: '/',            element: <Home /> },
      { path: '/records',     element: <RecordList /> },
      { path: '/profile',     element: <Profile /> },
      { path: '/pay/form/:category', element: <PayForm /> },
      { path: '/pay/confirm', element: <PayConfirm /> },
      { path: '/pay/result',  element: <PayResult /> },
    ],
  },
  // /login 和未知路由都跳首页
  { path: '/login', element: <Navigate to="/" replace /> },
  { path: '*',      element: <Navigate to="/" replace /> },
], { basename: import.meta.env.BASE_URL })
