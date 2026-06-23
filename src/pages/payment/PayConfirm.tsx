import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, List, Button, Radio, Space, Divider, Toast } from 'antd-mobile'
import PageLayout from '@/components/layout/PageLayout'
import { categoryIcon } from '@/utils/mock'
import { formatAmountWithSymbol } from '@/utils/format'
import { useCoinsStore } from '@/store/coins'
import styles from './PayConfirm.module.css'

interface PayState {
  category: string
  account: string
  amount: number
  title: string
}

const STATIC_METHODS = [
  { value: 'alipay',    label: '支付宝',   icon: '🔵' },
  { value: 'wechat',    label: '微信支付', icon: '🟢' },
  { value: 'bank_card', label: '银行卡',   icon: '🏦' },
]

export default function PayConfirm() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: PayState }
  const [method, setMethod] = useState('alipay')
  const { balance, spend } = useCoinsStore()

  if (!state) {
    navigate('/', { replace: true })
    return null
  }

  const { category, account, amount, title } = state

  function handleConfirm() {
    const coinsNeeded = Math.ceil(amount / 100)
    if (method === 'balance') {
      const ok = spend(coinsNeeded)
      if (!ok) {
        Toast.show({ icon: 'fail', content: `金币不足，当前余额 ${balance} 枚，需要 ${coinsNeeded} 枚`, duration: 2500 })
        return
      }
    }
    navigate('/pay/result', {
      state: {
        ...state,
        method,
        tradeNo: `T${Date.now()}`,
        paidAt: new Date().toISOString(),
        coinsSpent: method === 'balance' ? coinsNeeded : 0,
      },
    })
  }

  return (
    <PageLayout title="确认缴费">
      <div className={styles.root}>
        {/* 订单摘要 */}
        <div className={styles.summary}>
          <div className={styles.iconWrap}>
            {categoryIcon[category] ?? '💳'}
          </div>
          <p className={styles.summaryTitle}>{title}</p>
          <p className={styles.summaryAmount}>{formatAmountWithSymbol(amount)}</p>
        </div>

        {/* 缴费详情 */}
        <Card className={styles.card}>
          <List>
            <List.Item extra={account}>缴费账号</List.Item>
            <List.Item extra={title}>缴费项目</List.Item>
            <List.Item
              extra={
                <span className={styles.amountDetail}>
                  {formatAmountWithSymbol(amount)}
                </span>
              }
            >
              缴费金额
            </List.Item>
          </List>
        </Card>

        {/* 支付方式 */}
        <Card title="选择支付方式" className={styles.card}>
          <Radio.Group value={method} onChange={(v) => setMethod(v as string)}>
            <Space direction="vertical" block>
              {STATIC_METHODS.map((m) => (
                <Radio key={m.value} value={m.value} block>
                  <span className={styles.methodLabel}>
                    {m.icon}&nbsp;&nbsp;{m.label}
                  </span>
                </Radio>
              ))}
              <Radio value="balance" block>
                <span className={styles.methodLabel}>
                  🪙&nbsp;&nbsp;金币支付
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 8 }}>
                    余额 {balance.toLocaleString()} 枚
                  </span>
                </span>
              </Radio>
            </Space>
          </Radio.Group>
        </Card>

        <Divider />

        <Button
          block
          color="primary"
          size="large"
          onClick={handleConfirm}
        >
          确认缴费 {formatAmountWithSymbol(amount)}
        </Button>
      </div>
    </PageLayout>
  )
}
