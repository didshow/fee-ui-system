import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Toast } from 'antd-mobile'
import { useAuthStore } from '@/store/auth'
import { useCoinsStore } from '@/store/coins'
import { useInviteStore, INVITE_REWARD_COINS } from '@/store/invite'
import type { Invitee } from '@/store/invite'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

export default function Invite() {
  const navigate = useNavigate()
  const userId   = useAuthStore((s) => s.userId)
  const topUp    = useCoinsStore((s) => s.topUp)
  const { code, invitees, ensureCode, markRewarded } = useInviteStore()

  useEffect(() => {
    if (userId) ensureCode(userId)
  }, [userId, ensureCode])

  const displayCode     = code ?? '生成中…'
  const totalRewarded   = invitees.filter((i) => i.rewarded).length
  const pendingCount    = invitees.filter((i) => !i.rewarded).length

  function handleCopy() {
    if (!code) return
    navigator.clipboard.writeText(code).then(() =>
      Toast.show({ icon: 'success', content: '邀请码已复制', duration: 1500 })
    )
  }

  function handleShare() {
    const text = `我在智慧缴费平台缴费超方便！用我的邀请码 ${code} 注册，双方各得 ${INVITE_REWARD_COINS} 金币！`
    if (navigator.share) {
      navigator.share({ title: '邀请你加入智慧缴费', text })
    } else {
      navigator.clipboard.writeText(text).then(() =>
        Toast.show({ icon: 'success', content: '分享内容已复制，可直接粘贴发送', duration: 2000 })
      )
    }
  }

  function claimReward(invitee: Invitee) {
    topUp(INVITE_REWARD_COINS)
    markRewarded(invitee.phone)
    Toast.show({ icon: 'success', content: `已到账 +${INVITE_REWARD_COINS} 金币！`, duration: 2000 })
  }

  return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100dvh' }}>
      <NavBar onBack={() => navigate(-1)}>邀请有礼</NavBar>

      <div style={{ padding: '12px 16px 80px' }}>

        {/* ── 活动横幅 ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #40a9ff 100%)',
          borderRadius: 16, padding: '24px 20px', marginBottom: 20,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', pointerEvents: 'none',
          }} />
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>每成功邀请 1 位好友</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
            双方各得 <span style={{ color: '#ffd700' }}>{INVITE_REWARD_COINS}</span> 金币 🪙
          </div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>好友注册后即可手动领取奖励</div>
        </div>

        {/* ── 邀请码 ── */}
        <SectionTitle>我的邀请码</SectionTitle>
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px 16px', marginBottom: 20, textAlign: 'center' }}>
          <div style={{
            fontSize: 28, fontWeight: 800, letterSpacing: 4,
            color: 'var(--color-primary)', marginBottom: 16,
          }}>
            {displayCode}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCopy} style={{
              flex: 1, padding: '10px 0',
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              📋 复制邀请码
            </button>
            <button onClick={handleShare} style={{
              flex: 1, padding: '10px 0',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              🔗 分享给好友
            </button>
          </div>
        </div>

        {/* ── 数据统计 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: '已邀请', value: invitees.length,                        unit: '人' },
            { label: '已到账', value: totalRewarded * INVITE_REWARD_COINS,    unit: '🪙' },
            { label: '待领取', value: pendingCount   * INVITE_REWARD_COINS,   unit: '🪙' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#fff', borderRadius: 12, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)' }}>
                {item.value}<span style={{ fontSize: 13, marginLeft: 2 }}>{item.unit}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* ── 邀请记录 ── */}
        <SectionTitle>邀请记录</SectionTitle>
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
          {invitees.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 14 }}>
              还没有邀请记录，快去邀请好友吧 🎉
            </div>
          ) : (
            invitees.map((invitee, i) => (
              <div key={invitee.phone} style={{
                display: 'flex', alignItems: 'center', padding: '14px 16px',
                borderBottom: i < invitees.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: 'var(--color-primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, marginRight: 12, flexShrink: 0,
                }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {invitee.phone}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                    {formatTime(invitee.joinedAt)} 注册
                  </div>
                </div>
                {invitee.rewarded ? (
                  <span style={{
                    fontSize: 12, color: 'var(--color-success)',
                    background: 'var(--color-success-light)',
                    padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                  }}>
                    已到账 +{INVITE_REWARD_COINS}🪙
                  </span>
                ) : (
                  <button onClick={() => claimReward(invitee)} style={{
                    background: 'var(--color-primary)', color: '#fff',
                    border: 'none', borderRadius: 20, padding: '5px 14px',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    领取奖励
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── 活动规则 ── */}
        <SectionTitle>活动规则</SectionTitle>
        <div style={{
          background: '#fff', borderRadius: 12, padding: '14px 16px',
          fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 2,
        }}>
          {[
            '1. 邀请好友通过您的专属邀请码注册',
            `2. 好友注册后，双方各获得 ${INVITE_REWARD_COINS} 金币奖励`,
            '3. 邀请奖励需手动点击「领取奖励」按钮领取',
            '4. 金币可用于抵扣缴费费用，1金币 = 1元',
            '5. 同一手机号仅可被邀请一次',
            '6. 平台保留对活动的最终解释权',
          ].map((rule) => <div key={rule}>{rule}</div>)}
        </div>

      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 3, height: 15, background: 'var(--color-primary)', borderRadius: 2 }} />
      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>{children}</span>
    </div>
  )
}
