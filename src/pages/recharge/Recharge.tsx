import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Toast } from 'antd-mobile'
import { useAuthStore } from '@/store/auth'
import { useCoinsStore } from '@/store/coins'

// ─── Types ──────────────────────────────────────────────────────────────────

type PlanId = 'basic' | 'recommended' | 'premium'

interface Plan {
  id: PlanId
  price: number
  coins: number
  bonus: number
  label?: string
  highlight: boolean
}

interface Service {
  icon: string
  name: string
  coins: number
  category: string
}

interface Promotion {
  icon: string
  title: string
  desc: string
  tag?: string
}

interface SecurityBadge {
  icon: string
  title: string
  desc: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  { id: 'basic',       price: 100,  coins: 100,  bonus: 0,   highlight: false },
  { id: 'recommended', price: 500,  coins: 550,  bonus: 50,  label: '推荐', highlight: true },
  { id: 'premium',     price: 1000, coins: 1150, bonus: 150, highlight: false },
]

const SERVICES: Service[] = [
  { icon: '⚡', name: '电费缴纳', coins: 100, category: 'electricity' },
  { icon: '🔥', name: '燃气费',   coins: 80,  category: 'gas' },
  { icon: '💧', name: '水费缴纳', coins: 50,  category: 'water' },
  { icon: '🏢', name: '物业费',   coins: 200, category: 'property' },
  { icon: '📱', name: '手机充值', coins: 30,  category: 'phone' },
  { icon: '🌐', name: '宽带缴费', coins: 120, category: 'internet' },
]

const PROMOTIONS: Promotion[] = [
  { icon: '🎁', title: '首充奖励', desc: '首次充值额外赠 20%',  tag: 'NEW' },
  { icon: '⏰', title: '限时加赠', desc: '今日限时双倍金币',    tag: 'HOT' },
  { icon: '🎉', title: '节日活动', desc: '节日期间享专属优惠' },
  { icon: '👑', title: '会员专享', desc: '会员每月赠送金币',    tag: 'VIP' },
]

const SECURITY_BADGES: SecurityBadge[] = [
  { icon: '🔐', title: '资金安全', desc: '银行级加密保护' },
  { icon: '🏛️', title: '官方合作', desc: '正规持牌机构' },
  { icon: '⚡', title: '实时到账', desc: '秒级充值到账' },
  { icon: '🎧', title: '客服支持', desc: '7×24 小时在线' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCountdown(totalSeconds: number): { h: string; m: string; s: string } {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
  }
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Recharge() {
  const navigate = useNavigate()
  const userId          = useAuthStore((s) => s.userId)
  const { balance, topUp } = useCoinsStore()

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('recommended')
  const [countdown, setCountdown]       = useState(6 * 3600) // 6-hour timer

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentPlan = PLANS.find((p) => p.id === selectedPlan)!
  const { h, m, s } = formatCountdown(countdown)

  function handleBuy() {
    topUp(currentPlan.coins)
    Toast.show({
      icon: 'success',
      content: `充值成功！获得 ${currentPlan.coins} 金币`,
      duration: 1800,
    })
  }

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100dvh', color: '#fff' }}>

      {/* ── 顶部导航 ── */}
      <NavBar
        onBack={() => navigate(-1)}
        style={{ '--border-bottom': 'none', background: 'transparent' } as React.CSSProperties}
      >
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>充值中心</span>
      </NavBar>

      <div style={{ padding: '0 16px 100px' }}>

        {/* ── 资产概览卡片 ── */}
        <AssetCard userId={userId} balance={balance} />

        {/* ── 充值套餐 ── */}
        <SectionTitle>选择充值套餐</SectionTitle>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* 立即购买 CTA */}
        <button onClick={handleBuy} style={buyBtnStyle}>
          立即购买 · ¥{currentPlan.price} 获得 {currentPlan.coins} 🪙
        </button>
        {currentPlan.bonus > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#ffd700', marginBottom: 28, marginTop: 6 }}>
            🎁 含赠送 {currentPlan.bonus} 金币，超值多赠{' '}
            {((currentPlan.bonus / currentPlan.price) * 100).toFixed(0)}%
          </p>
        )}
        {currentPlan.bonus === 0 && <div style={{ marginBottom: 28 }} />}

        {/* ── 优惠活动区 ── */}
        <SectionTitle>优惠活动</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {PROMOTIONS.map((promo, i) => (
            <PromoCard
              key={promo.title}
              promo={promo}
              countdown={i === 1 ? `${h}:${m}:${s}` : undefined}
            />
          ))}
        </div>

        {/* ── 生活缴费服务宫格 ── */}
        <SectionTitle>生活缴费服务</SectionTitle>
        <div style={gridCardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {SERVICES.map((svc, i) => (
              <ServiceCell
                key={svc.category}
                service={svc}
                bottomBorder={i < 3}
                rightBorder={(i + 1) % 3 !== 0}
              />
            ))}
          </div>
        </div>

        {/* ── 安全保障区 ── */}
        <SectionTitle>安全保障</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 28 }}>
          {SECURITY_BADGES.map((badge) => (
            <SecurityCell key={badge.title} badge={badge} />
          ))}
        </div>

        {/* ── 底部 ── */}
        <Footer />
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AssetCard({ userId, balance }: { userId: string | null; balance: number }) {
  const navigate = useNavigate()
  return (
    <div style={{
      background: 'linear-gradient(135deg, #b8860b 0%, #daa520 40%, #ffd700 70%, #b8860b 100%)',
      borderRadius: 20,
      padding: '24px 20px',
      marginBottom: 24,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(218,165,32,0.4)',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160,
        background: 'rgba(255,255,255,0.12)', borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -20,
        width: 200, height: 200,
        background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* User row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          👤
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>用户账号</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a0a00' }}>
            {userId ?? 'U1001'}
          </div>
        </div>
      </div>

      {/* Balance */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 4 }}>金币余额</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 14, color: '#1a0a00', fontWeight: 600 }}>🪙</span>
          <span style={{ fontSize: 38, fontWeight: 800, color: '#1a0a00', lineHeight: 1 }}>
            {balance.toLocaleString()}
          </span>
          <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)' }}>金币</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/records')}
        style={{
          marginTop: 12, background: 'rgba(0,0,0,0.15)',
          border: 'none', borderRadius: 20, color: '#1a0a00',
          fontSize: 12, padding: '4px 14px', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}
      >
        查看充值记录 →
      </button>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 3, height: 16,
        background: 'linear-gradient(180deg, #ffd700, #b8860b)',
        borderRadius: 2,
      }} />
      <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{children}</span>
    </div>
  )
}

interface PlanCardProps {
  plan: Plan
  selected: boolean
  onSelect: () => void
}

function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        flex: 1,
        borderRadius: 14,
        padding: '14px 8px 12px',
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center',
        border: selected
          ? '2px solid #ffd700'
          : plan.highlight
          ? '2px solid rgba(212,160,23,0.4)'
          : '2px solid rgba(255,255,255,0.1)',
        background: selected
          ? 'linear-gradient(160deg, rgba(212,160,23,0.22), rgba(255,215,0,0.06))'
          : plan.highlight
          ? 'linear-gradient(160deg, rgba(212,160,23,0.1), rgba(15,23,42,0.5))'
          : 'rgba(255,255,255,0.03)',
        boxShadow: selected ? '0 0 20px rgba(255,215,0,0.2)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Recommended badge */}
      {plan.label && (
        <div style={{
          position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(90deg, #b8860b, #ffd700)',
          color: '#1a0a00', fontSize: 10, fontWeight: 700,
          padding: '2px 10px', borderRadius: 20, whiteSpace: 'nowrap',
        }}>
          ★ {plan.label}
        </div>
      )}

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: plan.label ? 8 : 0, marginBottom: 3 }}>
        充值
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#ffd700', marginBottom: 2 }}>
        ¥{plan.price}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
        得 {plan.coins} 🪙
      </div>

      {plan.bonus > 0 ? (
        <div style={{
          background: 'rgba(255,59,48,0.15)',
          border: '1px solid rgba(255,59,48,0.3)',
          borderRadius: 20, fontSize: 10, fontWeight: 600,
          color: '#ff6b6b', padding: '2px 8px', display: 'inline-block',
        }}>
          +{plan.bonus} 赠送
        </div>
      ) : (
        <div style={{ height: 22 }} />
      )}

      {/* Checkmark when selected */}
      {selected && (
        <div style={{
          position: 'absolute', bottom: 6, right: 6,
          width: 16, height: 16, borderRadius: '50%',
          background: '#ffd700',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: '#1a0a00', fontWeight: 700,
        }}>
          ✓
        </div>
      )}
    </div>
  )
}

interface PromoCardProps {
  promo: Promotion
  countdown?: string
}

function PromoCard({ promo, countdown }: PromoCardProps) {
  const [hh, mm, ss] = countdown ? countdown.split(':') : []
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 14, padding: '14px', cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontSize: 24 }}>{promo.icon}</span>
        {promo.tag && <TagBadge tag={promo.tag} />}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
        {promo.title}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
        {promo.desc}
      </div>
      {countdown && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>剩余</span>
          {[hh, mm, ss].map((unit, i) => (
            <span key={i} style={{
              background: '#1a0a00', borderRadius: 4,
              padding: '1px 4px', fontSize: 11, fontWeight: 700,
              color: '#ffd700', fontVariantNumeric: 'tabular-nums',
            }}>
              {unit}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function TagBadge({ tag }: { tag: string }) {
  const isVip = tag === 'VIP'
  const isHot = tag === 'HOT'
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
      background: isVip
        ? 'linear-gradient(90deg, #b8860b, #ffd700)'
        : isHot
        ? 'rgba(255,59,48,0.85)'
        : 'rgba(0,122,255,0.8)',
      color: isVip ? '#1a0a00' : '#fff',
    }}>
      {tag}
    </span>
  )
}

interface ServiceCellProps {
  service: Service
  bottomBorder: boolean
  rightBorder: boolean
}

function ServiceCell({ service, bottomBorder, rightBorder }: ServiceCellProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/pay/form/${service.category}`)}
      style={{
        padding: '18px 8px',
        textAlign: 'center',
        cursor: 'pointer',
        borderBottom: bottomBorder ? '1px solid rgba(255,255,255,0.06)' : 'none',
        borderRight: rightBorder ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 6 }}>{service.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
        {service.name}
      </div>
      <div style={{ fontSize: 11, color: '#d4a017' }}>{service.coins} 🪙起</div>
    </div>
  )
}

function SecurityCell({ badge }: { badge: SecurityBadge }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '12px 6px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{badge.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
        {badge.title}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
        {badge.desc}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12, lineHeight: 1.8 }}>
        本平台提供安全、便捷的生活缴费服务<br />
        金币为平台虚拟货币，不可兑换现金
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        {['服务协议', '隐私政策', '联系我们', '关于平台'].map((item) => (
          <span key={item} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const buyBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: 'linear-gradient(90deg, #b8860b, #ffd700, #b8860b)',
  border: 'none',
  borderRadius: 14,
  fontSize: 17,
  fontWeight: 700,
  color: '#1a0a00',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(212,160,23,0.45)',
  letterSpacing: 0.5,
}

const gridCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.08)',
  overflow: 'hidden',
  marginBottom: 28,
}
