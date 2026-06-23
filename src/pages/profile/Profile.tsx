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
  GiftOutline,
  PhonebookOutline,
  SendOutline,
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
      { icon: <GiftOutline />,        label: '金币充值', path: '/recharge' },
      { icon: <SendOutline />,         label: '邀请有礼', path: '/invite' },
      { icon: <BellOutline />,        label: '消息通知', path: null },
    ],
  },
  {
    title: '帮助与设置',
    items: [
      { icon: <PhonebookOutline />,           label: '联系客服', path: '/customer-service' },
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
  const logout = useAuthStore((s) => s.logout)

  function handleItem(path: string | null) {
    if (path) navigate(path)
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  // ── 未登录态 ──────────────────────────────────────────────────
  if (!userId) {
    return (
      <div className={styles.root}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '60px 32px 40px',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'var(--color-bg-input)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, marginBottom: 20,
          }}>
            👤
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
            登录后享受全部服务
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 32, textAlign: 'center' }}>
            缴费记录、金币余额、邀请好友等功能需登录后使用
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', padding: '14px 0',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700,
              cursor: 'pointer', marginBottom: 12,
            }}
          >
            立即登录
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              width: '100%', padding: '13px 0',
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer',
            }}
          >
            注册账号
          </button>
        </div>
        <p className={styles.version}>版本 v1.0.0</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {/* 用户信息头部 */}
      <div className={styles.header}>
        <Avatar
          src=""
          className={styles.avatar}
          fallback={<span>{userId ? userId.slice(-2) : '用'}</span>}
        />
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
        <button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </button>
      </div>

      <p className={styles.version}>版本 v1.0.0</p>
    </div>
  )
}
