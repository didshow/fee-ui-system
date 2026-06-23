import { Empty } from 'antd-mobile'
import { SearchOutline, FilterOutline, DownOutline, AppOutline, RightOutline, ClockCircleOutline } from 'antd-mobile-icons'
import { mockRecords, mockBills, categoryIcon } from '@/utils/mock'
import { formatAmount } from '@/utils/format'
import styles from './RecordList.module.css'

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


export default function RecordList() {
  return (
    <div className={styles.root}>
      {/* 蓝色头部 */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <p className={styles.title}>我的订单</p>
        </div>
        <div className={styles.searchBar}>
          <SearchOutline className={styles.searchIcon} />
          <span className={styles.searchPlaceholder}>搜索订单 / 账号 / 业务名称</span>
        </div>
      </header>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <button className={styles.filterChip}><FilterOutline /> 状态 <DownOutline /></button>
        <button className={styles.filterChip}><AppOutline /> 分类 <DownOutline /></button>
        <button className={styles.filterChip}><ClockCircleOutline /> 时间↓ <DownOutline /></button>
        <span className={styles.filterCount}>共 {records.length} 笔</span>
      </div>

      {/* 操作按钮 */}
      <div className={styles.actionBar}>
        <button className={styles.actionBtnOnline}>全部上线</button>
        <button className={styles.actionBtnOffline}>全部下线</button>
      </div>

      {/* 订单列表 */}
      {records.length === 0 ? (
        <Empty description="暂无订单" className={styles.empty} />
      ) : (
        records.map((record) => {
          const cat = record.bill?.category
          const style = cat ? categoryStyle[cat] : { bg: '#f5f5f5', color: '#999' }
          const icon = cat ? categoryIcon[cat] : '💳'
          const title = record.bill?.title ?? '话费充值'
          return (
            <div key={record.id} className={styles.orderCard}>
              <div className={styles.orderCardHeader}>
                <div className={styles.orderOperator}>
                  <div className={styles.orderIcon} style={{ background: style.bg, color: style.color }}>{icon}</div>
                  <span className={styles.orderTitle}>{title}</span>
                </div>
                <span className={styles.statusBadge}>待处理</span>
              </div>
              <div className={styles.orderFields}>
                <div className={styles.orderField}>
                  <span className={styles.orderFieldLabel}>账号</span>
                  <span className={styles.orderFieldValue}>{record.billIds[0] ?? '--'}</span>
                </div>
                <div className={styles.orderField}>
                  <span className={styles.orderFieldLabel}>订单号</span>
                  <span className={styles.orderFieldValue}>{record.id}</span>
                </div>
                <div className={styles.orderField}>
                  <span className={styles.orderFieldLabel}>充值金额</span>
                  <span className={styles.orderAmountValue}>¥{formatAmount(record.amount)}</span>
                </div>
              </div>
              <div className={styles.orderFooter}>
                <span className={styles.orderTime}>{new Date(record.paidAt).toLocaleString('zh-CN')}</span>
                <RightOutline className={styles.orderArrow} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
