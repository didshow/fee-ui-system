import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input, Toast, Popup } from 'antd-mobile'
import { InformationCircleOutline } from 'antd-mobile-icons'
import PageLayout from '@/components/layout/PageLayout'
import { categoryIcon } from '@/utils/mock'
import styles from './PayForm.module.css'

const categoryColor: Record<string, { bg: string; color: string }> = {
  phone:       { bg: '#1677ff', color: '#fff' },
  electricity: { bg: '#faad14', color: '#fff' },
  water:       { bg: '#1677ff', color: '#fff' },
  gas:         { bg: '#fa8c16', color: '#fff' },
  property:    { bg: '#722ed1', color: '#fff' },
  heating:     { bg: '#f5222d', color: '#fff' },
  internet:    { bg: '#13c2c2', color: '#fff' },
}

const formConfig: Record<string, {
  title: string
  accountLabel: string
  accountPlaceholder: string
  quickAmounts: number[]
  nameRequired?: boolean
}> = {
  phone: {
    title: '充话费',
    accountLabel: '手机号',
    accountPlaceholder: '请输入手机号码',
    quickAmounts: [100, 200, 300, 500, 1000, 2000],
    nameRequired: true,
  },
  electricity: {
    title: '缴电费',
    accountLabel: '用电户号',
    accountPlaceholder: '请输入用电户号',
    quickAmounts: [50, 100, 200, 500],
    nameRequired: false,
  },
  water: {
    title: '缴水费',
    accountLabel: '用水户号',
    accountPlaceholder: '请输入用水户号',
    quickAmounts: [50, 100, 200, 500],
    nameRequired: false,
  },
  gas: {
    title: '缴燃气',
    accountLabel: '燃气户号',
    accountPlaceholder: '请输入燃气户号',
    quickAmounts: [50, 100, 200, 500],
    nameRequired: false,
  },
  property: {
    title: '缴物业费',
    accountLabel: '房号',
    accountPlaceholder: '请输入房号，如 3-301',
    quickAmounts: [200, 500, 1000, 2000],
    nameRequired: false,
  },
  heating: {
    title: '缴暖气费',
    accountLabel: '供热户号',
    accountPlaceholder: '请输入供热户号',
    quickAmounts: [200, 500, 1000, 2000],
    nameRequired: false,
  },
  internet: {
    title: '缴宽带费',
    accountLabel: '宽带账号',
    accountPlaceholder: '请输入宽带账号',
    quickAmounts: [50, 100, 200, 300],
    nameRequired: false,
  },
}

export default function PayForm() {
  const navigate = useNavigate()
  const { category = 'electricity' } = useParams<{ category: string }>()
  const config = formConfig[category] ?? formConfig.electricity

  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [noticeVisible, setNoticeVisible] = useState(false)
  const catColor = categoryColor[category] ?? categoryColor.phone

  function selectQuickAmount(val: number) {
    setAmount(String(val))
  }

  function handleSubmit() {
    if (!account.trim()) {
      Toast.show({ content: `请输入${config.accountLabel}`, icon: 'fail' })
      return
    }
    const num = parseFloat(amount)
    if (!amount || isNaN(num) || num <= 0) {
      Toast.show({ content: '请输入有效金额', icon: 'fail' })
      return
    }
    navigate('/pay/confirm', {
      state: {
        category,
        account: account.trim(),
        amount: Math.round(num * 100),
        title: config.title,
      },
    })
  }

  return (
    <>
      <PageLayout
        title="业务详情"
        rightAction={
          <button className={styles.noticeBtn} onClick={() => setNoticeVisible(true)} style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none', color:'rgba(255,255,255,0.9)', fontSize:13, cursor:'pointer', padding:'4px 8px' }}>
            <InformationCircleOutline fontSize={16} />
            <span>须知</span>
          </button>
        }
      >
        <div className={styles.root}>
          <div className={styles.operatorCard}>
            <div className={styles.operatorIconBox} style={{ background: catColor.bg }}>
              <span style={{ fontSize: '1.5rem' }}>{categoryIcon[category] ?? '💳'}</span>
            </div>
            <span className={styles.operatorName}>{config.title}</span>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionLabel}>充值金额</div>
            <div className={styles.quickGrid}>
              {config.quickAmounts.map((val) => (
                <button
                  key={val}
                  className={`${styles.amountBtn} ${amount === String(val) ? styles.amountBtnActive : ''}`}
                  onClick={() => selectQuickAmount(val)}
                >
                  ¥{val}
                </button>
              ))}
            </div>
            <div className={styles.customInput}>
              <span className={styles.yuan}>¥</span>
              <Input
                type="number"
                value={amount}
                onChange={setAmount}
                placeholder="自定义金额"
                style={{ '--font-size': 'var(--font-base)' } as React.CSSProperties}
              />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionLabel}>充值信息</div>
            {config.nameRequired && (
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>真实姓名<span className={styles.required}>*</span></label>
                <div className={styles.fieldInputWrap}>
                  <Input
                    value={name}
                    onChange={setName}
                    placeholder="请输入真实姓名"
                    clearable
                  />
                </div>
              </div>
            )}
            <div className={styles.formField}>
              <label className={styles.fieldLabel}>{config.accountLabel}<span className={styles.required}>*</span></label>
              <div className={styles.fieldInputWrap}>
                <Input
                  value={account}
                  onChange={setAccount}
                  placeholder={config.accountPlaceholder}
                  clearable
                />
              </div>
            </div>
          </div>

          <div style={{ height: 80 }} />
        </div>
      </PageLayout>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerLabel}>实付金额</span>
          <span className={styles.footerAmount}>{amount ? `¥${amount}` : '--'} 元</span>
        </div>
        <button className={styles.footerBtn} onClick={handleSubmit}>立即下单</button>
      </div>

      <NoticePopup visible={noticeVisible} onClose={() => setNoticeVisible(false)} />
    </>
  )
}

function NoticePopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Popup visible={visible} onMaskClick={onClose} bodyStyle={{ borderRadius: '16px 16px 0 0', maxHeight: '80vh', overflowY: 'auto' as const }}>
      <div className={styles.noticeWrap}>
        <div className={styles.noticeHeading}>
          <span className={styles.noticeTitleBar} />
          业务说明
        </div>
        <div className={styles.noticeSection}>
          <p className={styles.noticeSectionTitle}>1. 充值到账时间</p>
          <p>预计 <strong style={{ color: '#fa8c16' }}>1 – 7 天</strong> 内到账。</p>
        </div>
        <div className={styles.noticeSection}>
          <p className={styles.noticeSectionTitle}>2. 售后服务</p>
          <p>本区域话费充值进算，<span style={{ color: '#f5222d' }}>无售后</span>。</p>
        </div>
        <div className={styles.noticeSection}>
          <p className={styles.noticeSectionTitle}>3. 充值金额</p>
          <p>100元起充（<strong style={{ color: '#1677ff' }}>300以上较快</strong>）。</p>
        </div>
        <div className={styles.noticeHighlight}>
          <p className={styles.noticeHighlightTitle}>4. 实名要求</p>
          <p>移动 / 电信 / 联通用户必须填写 <span style={{ color: '#f5222d', textDecoration: 'underline' }}>真实姓名</span>，否则无法充值。</p>
        </div>
        <div className={styles.noticeSection}>
          <p className={styles.noticeSectionTitle}>5. 充值须知</p>
          <ul className={styles.noticeList}>
            <li>禁止多个平台同时充值，最终以 <strong>平台识别余额</strong> 为准。</li>
            <li>若充值未到账，请及时联系客服。</li>
          </ul>
          <div className={styles.noticeSubCard}>
            <p>1. 提供北京时间截图</p>
            <p>2. 短信登录营业厅并录制视频</p>
            <p style={{ color: '#86909c', fontSize: 12, marginTop: 4 }}>视频需清晰展示：充值手机号、当前余额、历史缴费记录。</p>
          </div>
        </div>
        <div className={styles.noticeTip}>请确保填写正确的信息，以免影响充值进度！</div>
        <div className={styles.noticeFooter}>
          <button className={styles.noticeBtnClose} onClick={onClose}>关闭</button>
          <button className={styles.noticeBtnConfirm} onClick={onClose}>已查看，不再提示</button>
        </div>
      </div>
    </Popup>
  )
}
