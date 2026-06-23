import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const Home       = lazy(() => import('@/pages/home/Home'))
const PayForm    = lazy(() => import('@/pages/payment/PayForm'))
const PayConfirm = lazy(() => import('@/pages/payment/PayConfirm'))
const PayResult  = lazy(() => import('@/pages/payment/PayResult'))
const RecordList = lazy(() => import('@/pages/record/RecordList'))
const Profile    = lazy(() => import('@/pages/profile/Profile'))
const Recharge        = lazy(() => import('@/pages/recharge/Recharge'))
const CustomerService = lazy(() => import('@/pages/customer-service/CustomerService'))
const BillList        = lazy(() => import('@/pages/bill/BillList'))
const Login           = lazy(() => import('@/pages/auth/Login'))
const Register        = lazy(() => import('@/pages/auth/Register'))
const Invite          = lazy(() => import('@/pages/invite/Invite'))

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
      { path: '/recharge',          element: <Recharge /> },
      { path: '/customer-service', element: <CustomerService /> },
      { path: '/bills',            element: <BillList /> },
      { path: '/invite',           element: <Invite /> },
    ],
  },
  // /login 和未知路由都跳首页
  { path: '/login',    element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '*',      element: <Navigate to="/" replace /> },
], { basename: import.meta.env.BASE_URL })
