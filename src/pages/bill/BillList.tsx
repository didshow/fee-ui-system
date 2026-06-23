import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Tabs, Empty } from 'antd-mobile'
import { mockBills, categoryIcon, categoryLabel } from '@/utils/mock'
import { formatAmountWithSymbol, formatDate, isOverdue } from '@/utils/format'
import type { Bill, BillStatus } from '@/types/bill'

// ─── Types & constants ────────────────────────────────────────────────────────

type FilterTab = 'all' | 'unpaid' | 'paid' | 'overdue'

const TAB_LABELS: Record<FilterTab, string> = {
  all: '全部', unpaid: '待缴', paid: '已缴', overdue: '逾期',
}

const STATUS_STYLE: Record<BillStatus, { bg: string; color: string; label: string }> = {
  unpaid:  { bg: '#fffbe6', color: '#d48806', label: '待缴费' },
  paid:    { bg: '#f6ffed', color: '#389e0d', label: '已缴费' },
  overdue: { bg: '#fff1f0', color: '#cf1322', label: '已逾期' },
  partial: { bg: '#e8f4ff', color: '#0958d9', label: '部分缴' },
}

const CATEGORY_COLOR: Record<string, { bg: string; color: string }> = {
  electricity: { bg: '#fffbe6', color: '#faad14' },
  water:       { bg: '#e8f4ff', color: '#1677ff' },
  gas:         { bg: '#fff7e6', color: '#fa8c16' },
  property:    { bg: '#f9f0ff', color: '#722ed1' },
  phone:       { bg: '#f6ffed', color: '#52c41a' },
  heating:     { bg: '#fff1f0', color: '#f5222d' },
  internet:    { bg: '#e6fffb', color: '#13c2c2' },
}

function filterBills(bills: Bill[], tab: FilterTab): Bill[] {
  if (tab === 'all') return bills
  if (tab === 'overdue') return bills.filter((b) => b.status === 'overdue' || isOverdue(b.dueDate))
  return bills.filter((b) => b.status === tab)
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BillList() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<FilterTab>('all')

  const displayed    = filterBills(mockBills, tab)
  const unpaidCount  = mockBills.filter((b) => b.status === 'unpaid').length
  const overdueCount = mockBills.filter((b) => b.status === 'overdue' || isOverdue(b.dueDate)).length

  return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100dvh' }}>
      <NavBar onBack={() => navigate(-1)}>账单列表</NavBar>

      {/* ── 汇总条 ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        background: '#fff', borderBottom: '1px solid var(--color-border)', marginBottom: 8,
      }}>
        {[
          { label: '全部账单', value: mockBills.length, color: 'var(--color-text-primary)' },
          { label: '待缴费',   value: unpaidCount,       color: 'var(--color-warning)' },
          { label: '已逾期',   value: overdueCount,      color: 'var(--color-danger)' },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            padding: '14px 0', textAlign: 'center',
            borderRight: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* ── 筛选 Tabs ── */}
      <Tabs activeKey={tab} onChange={(k) => setTab(k as FilterTab)}
        style={{ background: '#fff', marginBottom: 8 }}>
        {(Object.keys(TAB_LABELS) as FilterTab[]).map((t) => (
          <Tabs.Tab key={t} title={
            <span>
              {TAB_LABELS[t]}
              {t === 'unpaid'  && unpaidCount  > 0 && <TabBadge count={unpaidCount}  color="var(--color-warning)" />}
              {t === 'overdue' && overdueCount > 0 && <TabBadge count={overdueCount} color="var(--color-danger)"  />}
            </span>
          } />
        ))}
      </Tabs>

      {/* ── 账单列表 ── */}
      <div style={{ padding: '0 12px 80px' }}>
        {displayed.length === 0
          ? <Empty description="暂无账单" style={{ marginTop: 60 }} />
          : displayed.map((bill) => <BillCard key={bill.id} bill={bill} />)
        }
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBadge({ count, color }: { count: number; color: string }) {
  return (
    <span style={{
      display: 'inline-block', marginLeft: 4,
      background: color, color: '#fff',
      borderRadius: 10, fontSize: 10, padding: '0 5px', lineHeight: '16px',
    }}>
      {count}
    </span>
  )
}

function BillCard({ bill }: { bill: Bill }) {
  const navigate  = useNavigate()
  const catColor  = CATEGORY_COLOR[bill.category] ?? { bg: '#f5f5f5', color: '#999' }
  const statusCfg = STATUS_STYLE[bill.status]
  const expired   = bill.status !== 'paid' && isOverdue(bill.dueDate)

  return (
    <div style={{
      background: '#fff', borderRadius: 12, marginBottom: 10,
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: expired ? '1px solid rgba(255,77,79,0.3)' : '1px solid transparent',
    }}>
      <div style={{ padding: '14px 14px 12px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 8, flexShrink: 0,
          background: catColor.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {categoryIcon[bill.category]}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <span style={{
              fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '62%',
            }}>
              {bill.title}
            </span>
            <span style={{
              fontSize: 16, fontWeight: 700,
              color: bill.status === 'paid' ? 'var(--color-text-secondary)' : 'var(--color-danger)',
            }}>
              {formatAmountWithSymbol(bill.amount)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              {categoryLabel[bill.category]}
            </span>
            {bill.roomNo && (
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>· 房间 {bill.roomNo}</span>
            )}
            <span style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 600,
              background: statusCfg.bg, color: statusCfg.color,
            }}>
              {expired ? '已逾期' : statusCfg.label}
            </span>
          </div>

          <div style={{
            fontSize: 12, marginTop: 4,
            color: expired ? 'var(--color-danger)' : 'var(--color-text-tertiary)',
          }}>
            截止日期：{formatDate(bill.dueDate)}
          </div>
        </div>
      </div>

      {bill.status !== 'paid' && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '10px 14px', display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={() => navigate(`/pay/form/${bill.category}`, {
              state: { prefillAmount: bill.amount / 100 },
            })}
            style={{
              background: expired ? 'var(--color-danger)' : 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 20,
              padding: '6px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {expired ? '立即补缴' : '去缴费'}
          </button>
        </div>
      )}
    </div>
  )
}
