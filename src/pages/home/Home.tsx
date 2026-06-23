import { useNavigate } from 'react-router-dom'
import { Card, Grid, List } from 'antd-mobile'
import { BellOutline, RightOutline } from 'antd-mobile-icons'
import { useAuthStore } from '@/store/auth'
import { useCoinsStore } from '@/store/coins'
import { mockRecords, mockBills, categoryIcon } from '@/utils/mock'
import { formatAmountWithSymbol } from '@/utils/format'
import styles from './Home.module.css'

// 全部缴费类型（4列两行）
const allCategories = [
  'phone', 'electricity', 'water', 'gas',
  'property', 'heating', 'internet',
] as const

const quickLabel: Record<string, string> = {
  phone:       '充话费',
  electricity: '缴电费',
  water:       '缴水费',
  gas:         '缴燃气',
  property:    '缴物业',
  heating:     '缴暖气',
  internet:    '缴宽带',
}

// 每个品类的图标背景色 + icon 色
const categoryStyle: Record<string, { bg: string; color: string }> = {
  phone:       { bg: '#f6ffed', color: '#52c41a' },
  electricity: { bg: '#fffbe6', color: '#faad14' },
  water:       { bg: '#e8f4ff', color: '#1677ff' },
  gas:         { bg: '#fff7e6', color: '#fa8c16' },
  property:    { bg: '#f9f0ff', color: '#722ed1' },
  heating:     { bg: '#fff1f0', color: '#f5222d' },
  internet:    { bg: '#e6fffb', color: '#13c2c2' },
}

const methodLabel: Record<string, string> = {
  alipay:    '支付宝',
  wechat:    '微信支付',
  bank_card: '银行卡',
  balance:   '余额',
}

// 最近缴费记录：关联账单信息
const recentRecords = mockRecords.slice(0, 5).map((r) => {
  const bill = mockBills.find((b) => r.billIds.includes(b.id))
  return { ...r, bill }
})

export default function Home() {
  const navigate = useNavigate()
  const userId  = useAuthStore((s) => s.userId)
  const balance = useCoinsStore((s) => s.balance)

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>你好，用户 {userId}</p>
          <p className={styles.subGreeting}>请选择缴费类型开始缴费</p>
        </div>
        <BellOutline fontSize={22} color="#fff" />
      </header>

      {/* ── 金币余额横幅 ── */}
      <div
        onClick={() => navigate('/recharge')}
        style={{
          margin: '0 12px 12px',
          borderRadius: 14,
          padding: '12px 16px',
          background: 'linear-gradient(90deg, #b8860b, #daa520, #ffd700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(212,160,23,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🪙</span>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', lineHeight: 1 }}>我的金币</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#1a0a00', lineHeight: 1.4 }}>{balance.toLocaleString()}</div>
          </div>
        </div>
        <div style={{
          background: '#1a0a00',
          color: '#ffd700',
          fontSize: 13,
          fontWeight: 700,
          padding: '6px 16px',
          borderRadius: 20,
        }}>
          去充值 →
        </div>
      </div>


      {/* ── 缴费类型 ── */}
      <div className={styles.section}>
        <Card title="缴费类型">
          <Grid columns={4} gap={8}>
            {allCategories.map((cat) => {
              const { bg, color } = categoryStyle[cat]
              return (
                <Grid.Item key={cat}>
                  <div
                    className={styles.quickItem}
                    onClick={() => navigate(`/pay/form/${cat}`)}
                  >
                    <div className={styles.quickIconWrap} style={{ background: bg }}>
                      <span className={styles.quickIcon} style={{ color }}>
                        {categoryIcon[cat]}
                      </span>
                    </div>
                    <span className={styles.quickLabel}>{quickLabel[cat]}</span>
                  </div>
                </Grid.Item>
              )
            })}
          </Grid>
        </Card>
      </div>

      {/* ── 最近缴费 ── */}
      <div className={styles.listHeader}>
        <span className={styles.sectionTitle}>最近缴费</span>
        <span className={styles.viewAll} onClick={() => navigate('/records')}>
          全部 <RightOutline fontSize={10} />
        </span>
      </div>

      {recentRecords.length === 0 ? (
        <div className={styles.section}>
          <Card>
            <div className={styles.empty}>暂无缴费记录</div>
          </Card>
        </div>
      ) : (
        <List>
          {recentRecords.map((record) => {
            const cat = record.bill?.category
            const style = cat ? categoryStyle[cat] : { bg: '#f5f5f5', color: '#999' }
            const icon = cat ? categoryIcon[cat] : '💳'
            const title = record.bill?.title ?? methodLabel[record.method]
            const date = new Date(record.paidAt).toLocaleDateString('zh-CN', {
              month: 'long',
              day: 'numeric',
            })
            return (
              <List.Item
                key={record.id}
                prefix={
                  <div
                    className={styles.recordIconWrap}
                    style={{ background: style.bg }}
                  >
                    <span style={{ color: style.color }}>{icon}</span>
                  </div>
                }
                description={`${date} · ${methodLabel[record.method]}`}
                extra={
                  <span className={styles.recordAmount}>
                    {formatAmountWithSymbol(record.amount)}
                  </span>
                }
                onClick={() => navigate('/records')}
              >
                {title}
              </List.Item>
            )
          })}
        </List>
      )}
    </div>
  )
}
