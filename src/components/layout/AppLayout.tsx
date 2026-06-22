import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
  AppOutline,
  HistogramOutline,
  UserOutline,
} from 'antd-mobile-icons'
import styles from './AppLayout.module.css'

const tabs = [
  { key: '/',        title: '首页', icon: <AppOutline /> },
  { key: '/records', title: '记录', icon: <HistogramOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // 精确匹配当前 tab，子页面不高亮 tab
  const activeKey = tabs.find((t) => t.key === pathname)?.key ?? '/'

  return (
    <div className={styles.root}>
      <main className={styles.content}>
        <Outlet />
      </main>
      <TabBar
        activeKey={activeKey}
        onChange={(key) => navigate(key)}
        className={styles.tabbar}
      >
        {tabs.map((tab) => (
          <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
        ))}
      </TabBar>
    </div>
  )
}
