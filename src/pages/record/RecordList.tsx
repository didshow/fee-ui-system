import { List, Tag, Empty } from 'antd-mobile'
import { mockRecords, mockBills, categoryIcon } from '@/utils/mock'
import { formatAmountWithSymbol } from '@/utils/format'
import styles from './RecordList.module.css'

const methodLabel: Record<string, string> = {
  alipay:    '支付宝',
  wechat:    '微信支付',
  bank_card: '银行卡',
  balance:   '余额',
}

const categoryStyle: Record<string, { bg: string; color: string }> = {
  phone:       { bg: '#f6ffed', color: '#52c41a' },
  electricity: { bg: '#fffbe6', color: '#faad14' },
  water:       { bg: '#e8f4ff', color: '#1677ff' },
  gas:         { bg: '#fff7e6', color: '#fa8c16' },
  property:    { bg: '#f9f0ff', color: '#722ed1' },
  heating:     { bg: '#fff1f0', color: '#f5222d' },
  internet:    { bg: '#e6fffb', color: '#13c2c2' },
}

const records = mockRecords.map((r) => {
  const bill = mockBills.find((b) => r.billIds.includes(b.id))
  return { ...r, bill, month: r.paidAt.slice(0, 7) }
})

const grouped = records.reduce<Record<string, typeof records>>((acc, r) => {
  if (!acc[r.month]) acc[r.month] = []
  acc[r.month].push(r)
  return acc
}, {})

const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

function monthLabel(ym: string) {
  const [year, month] = ym.split('-')
  return `${year}年${month}月`
}

export default function RecordList() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <p className={styles.title}>缴费记录</p>
        <p className={styles.sub}>共 {records.length} 笔</p>
      </header>

      {records.length === 0 ? (
        <Empty description="暂无缴费记录" className={styles.empty} />
      ) : (
        sortedMonths.map((month) => (
          <div key={month}>
            <div className={styles.monthLabel}>{monthLabel(month)}</div>
            <List>
              {grouped[month].map((record) => {
                const cat = record.bill?.category
                const style = cat ? categoryStyle[cat] : { bg: '#f5f5f5', color: '#999' }
                const icon = cat ? categoryIcon[cat] : '💳'
                const title = record.bill?.title ?? '缴费'
                const date = new Date(record.paidAt).toLocaleDateString('zh-CN', {
                  month: 'long', day: 'numeric',
                })

                return (
                  <List.Item
                    key={record.id}
                    prefix={
                      <div className={styles.iconWrap} style={{ background: style.bg }}>
                        <span style={{ color: style.color }}>{icon}</span>
                      </div>
                    }
                    description={`${date} · ${methodLabel[record.method] ?? record.method}`}
                    extra={
                      <div className={styles.extra}>
                        <span className={styles.amount}>
                          -{formatAmountWithSymbol(record.amount)}
                        </span>
                        <Tag
                          color={record.status === 'success' ? 'success' : 'danger'}
                          fill="outline"
                          style={{ marginTop: 4 }}
                        >
                          {record.status === 'success' ? '成功' : '失败'}
                        </Tag>
                      </div>
                    }
                  >
                    {title}
                  </List.Item>
                )
              })}
            </List>
          </div>
        ))
      )}
    </div>
  )
}
