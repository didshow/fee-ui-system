import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Collapse, Dialog, Toast } from 'antd-mobile'
import {
  PhonebookOutline,
  EditSOutline,
  ClockCircleOutline,
  CheckCircleOutline,
} from 'antd-mobile-icons'
import { useAuthStore } from '@/store/auth'
import { useMeiqia } from '@/hooks/useMeiqia'

// ─── Constants ────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string
  a: string
}

const FAQ: FaqItem[] = [
  {
    q: '金币充值后多久到账？',
    a: '充值成功后金币实时到账，一般不超过 1 分钟。如超过 5 分钟未到账，请联系在线客服并提供充值订单号。',
  },
  {
    q: '缴费失败但金币已扣除怎么办？',
    a: '系统会在 24 小时内自动退回金币。如超时未退，请提供缴费流水号联系客服，我们将人工核查并处理。',
  },
  {
    q: '支持哪些缴费类型？',
    a: '目前支持电费、燃气费、水费、物业费、手机充值、宽带缴费，后续将持续扩展更多服务。',
  },
  {
    q: '缴费记录在哪里查看？',
    a: '点击底部导航「记录」标签，可查看所有历史缴费记录，包括成功、失败和处理中的订单。',
  },
  {
    q: '金币可以退款吗？',
    a: '金币为平台虚拟货币，充值后不支持退款兑换现金。如因平台问题导致损失，将全额补偿。',
  },
  {
    q: '如何修改绑定的手机号？',
    a: '前往「我的 → 设置 → 账号安全」进行手机号变更，需通过原手机号短信验证后方可修改。',
  },
]

const WORK_HOURS = '09:00 – 21:00（每天）'
const SERVICE_PHONE = '400-000-0000'

function isOnline(): boolean {
  const h = new Date().getHours()
  return h >= 9 && h < 21
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomerService() {
  const navigate = useNavigate()
  const userId   = useAuthStore((s) => s.userId)
  const online   = isOnline()
  const { openChat, configured } = useMeiqia({ userId })

  const [feedback, setFeedback]   = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleOnlineChat() {
    if (!configured) {
      Toast.show({ content: '在线客服配置中，请使用电话联系', icon: 'fail', duration: 2000 })
      return
    }
    if (!online) {
      Toast.show({ content: `客服不在线，服务时间 ${WORK_HOURS}`, icon: 'fail', duration: 2500 })
      return
    }
    openChat()
  }

  function handlePhone() {
    Dialog.confirm({
      title: '电话客服',
      content: `拨打 ${SERVICE_PHONE}？`,
      confirmText: '拨打',
      onConfirm: () => { window.location.href = `tel:${SERVICE_PHONE}` },
    })
  }

  async function handleFeedback() {
    const text = feedback.trim()
    if (!text) {
      Toast.show({ content: '请输入留言内容', icon: 'fail' })
      return
    }
    setSubmitting(true)
    // TODO: replace with real API call to your backend
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setFeedback('')
    Toast.show({ content: '留言已提交，我们将在 24 小时内回复', icon: 'success', duration: 2500 })
  }

  return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100dvh' }}>

      <NavBar onBack={() => navigate(-1)}>客服中心</NavBar>

      <div style={{ padding: '12px 16px 80px' }}>

        {/* ── 在线状态卡片 ── */}
        <div style={{
          background: online
            ? 'linear-gradient(135deg, #0f9d58, #34c57a)'
            : 'linear-gradient(135deg, #8c8c8c, #bfbfbf)',
          borderRadius: 16,
          padding: '20px',
          marginBottom: 20,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#fff',
                boxShadow: online ? '0 0 6px #fff' : 'none',
                opacity: online ? 1 : 0.4,
              }} />
              <span style={{ fontSize: 16, fontWeight: 700 }}>
                {online ? '客服在线' : '客服不在线'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              服务时间 {WORK_HOURS}
            </div>
          </div>
          <PhonebookOutline fontSize={40} color="rgba(255,255,255,0.5)" />
        </div>

        {/* ── 三种联系方式 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          <QuickAction
            icon={<PhonebookOutline fontSize={26} />}
            label="在线客服"
            desc={online ? '立即响应' : '非服务时间'}
            active={online}
            onClick={handleOnlineChat}
          />
          <QuickAction
            icon={<PhonebookOutline fontSize={26} />}
            label="电话客服"
            desc={SERVICE_PHONE}
            active
            onClick={handlePhone}
          />
          <QuickAction
            icon={<EditSOutline fontSize={26} />}
            label="留言反馈"
            desc="24h 内回复"
            active
            onClick={() => document.getElementById('feedback-section')
              ?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>

        {/* ── 服务承诺条 ── */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 20,
          display: 'flex',
        }}>
          {[
            { icon: <CheckCircleOutline color="#52c41a" />, text: '问题 24h 响应' },
            { icon: <ClockCircleOutline color="#1677ff" />, text: '工单实时跟踪' },
            { icon: <CheckCircleOutline color="#52c41a" />, text: '满意度保障' },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* ── 常见问题 ── */}
        <SectionTitle>常见问题</SectionTitle>
        <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden' }}>
          <Collapse>
            {FAQ.map((item, i) => (
              <Collapse.Panel key={String(i)} title={item.q}>
                <p style={{
                  fontSize: 14,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                  margin: 0,
                }}>
                  {item.a}
                </p>
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>

        {/* ── 留言反馈 ── */}
        <div id="feedback-section">
          <SectionTitle>留言反馈</SectionTitle>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="请详细描述您的问题，我们将在 24 小时内回复..."
              maxLength={500}
              style={{
                width: '100%',
                minHeight: 120,
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 14,
                color: 'var(--color-text-primary)',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                {feedback.length}/500
              </span>
              <button
                onClick={handleFeedback}
                disabled={submitting}
                style={{
                  background: submitting ? '#d9d9d9' : 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  padding: '8px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? '提交中…' : '提交留言'}
              </button>
            </div>
          </div>
        </div>

        {/* ── 联系方式 ── */}
        <SectionTitle>联系方式</SectionTitle>
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { label: '客服电话', value: SERVICE_PHONE, onClick: handlePhone },
            { label: '服务时间', value: WORK_HOURS,    onClick: undefined },
            { label: '客服邮箱', value: 'support@example.com', onClick: undefined },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              onClick={row.onClick}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                cursor: row.onClick ? 'pointer' : 'default',
              }}
            >
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{row.label}</span>
              <span style={{
                fontSize: 14,
                color: row.onClick ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontWeight: row.onClick ? 600 : 400,
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 3, height: 15, background: 'var(--color-primary)', borderRadius: 2 }} />
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        {children}
      </span>
    </div>
  )
}

interface QuickActionProps {
  icon: React.ReactNode
  label: string
  desc: string
  active: boolean
  onClick: () => void
}

function QuickAction({ icon, label, desc, active, onClick }: QuickActionProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '16px 8px',
        textAlign: 'center',
        cursor: 'pointer',
        border: active
          ? '1px solid var(--color-primary-light)'
          : '1px solid var(--color-border)',
      }}
    >
      <div style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)', marginBottom: 6 }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{desc}</div>
    </div>
  )
}
