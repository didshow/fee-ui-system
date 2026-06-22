import { useNavigate } from 'react-router-dom'
import { List, Avatar } from 'antd-mobile'
import {
  ClockCircleOutline,
  BellOutline,
  QuestionCircleOutline,
  SmileOutline,
  InformationCircleOutline,
  RightOutline,
  SetOutline,
} from 'antd-mobile-icons'
import { useAuthStore } from '@/store/auth'
import { mockRecords } from '@/utils/mock'
import { formatAmount } from '@/utils/format'
import styles from './Profile.module.css'

const totalCount = mockRecords.length
const totalAmount = mockRecords.reduce((sum, r) => sum + r.amount, 0)
const successCount = mockRecords.filter((r) => r.status === 'success').length

const menuGroups = [
  {
    title: '我的服务',
    items: [
      { icon: <ClockCircleOutline />, label: '缴费记录', path: '/records' },
      { icon: <BellOutline />,        label: '消息通知', path: null },
    ],
  },
  {
    title: '帮助与设置',
    items: [
      { icon: <QuestionCircleOutline />,    label: '帮助中心', path: null },
      { icon: <SmileOutline />,             label: '意见反馈', path: null },
      { icon: <InformationCircleOutline />, label: '关于我们', path: null },
      { icon: <SetOutline />,               label: '设置',     path: null },
    ],
  },
]

export default function Profile() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.userId)

  function handleItem(path: string | null) {
    if (path) navigate(path)
  }

  return (
    <div className={styles.root}>
      {/* 用户信息头部 */}
      <div className={styles.header}>
        <Avatar src="" className={styles.avatar}>
          {userId ? userId.slice(-2) : '用户'}
        </Avatar>
        <div className={styles.userInfo}>
          <p className={styles.userName}>用户 {userId ?? '未登录'}</p>
          <p className={styles.userTag}>普通用户</p>
        </div>
      </div>

      {/* 数据统计 */}
      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{totalCount}</span>
          <span className={styles.statLabel}>缴费次数</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>¥{formatAmount(totalAmount)}</span>
          <span className={styles.statLabel}>累计缴费</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>{successCount}</span>
          <span className={styles.statLabel}>成功笔数</span>
        </div>
      </div>

      {/* 菜单组 */}
      {menuGroups.map((group) => (
        <div key={group.title} className={styles.section}>
          <p className={styles.sectionTitle}>{group.title}</p>
          <List className={styles.list}>
            {group.items.map((item) => (
              <List.Item
                key={item.label}
                prefix={<span className={styles.menuIcon}>{item.icon}</span>}
                arrow={<RightOutline />}
                onClick={() => handleItem(item.path)}
                className={styles.listItem}
              >
                {item.label}
              </List.Item>
            ))}
          </List>
        </div>
      ))}

      {/* 退出登录 */}
      <div className={styles.logoutWrap}>
        <button className={styles.logoutBtn} onClick={() => navigate('/')}>
          退出登录
        </button>
      </div>

      <p className={styles.version}>版本 v1.0.0</p>
    </div>
  )
}
