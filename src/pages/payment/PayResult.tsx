import { useNavigate, useLocation } from 'react-router-dom'
import { Result, Button, List } from 'antd-mobile'
import { CheckCircleFill } from 'antd-mobile-icons'
import { formatAmountWithSymbol } from '@/utils/format'
import styles from './PayResult.module.css'

interface PayResultState {
  category: string
  account: string
  amount: number
  title: string
  method: string
  tradeNo: string
  paidAt: string
}

const methodLabel: Record<string, string> = {
  alipay:    '支付宝',
  wechat:    '微信支付',
  bank_card: '银行卡',
  balance:   '余额',
}

export default function PayResult() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: PayResultState }

  if (!state) {
    navigate('/', { replace: true })
    return null
  }

  const { account, amount, title, method, tradeNo, paidAt } = state

  const paidTime = new Date(paidAt).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={styles.root}>
      <Result
        icon={<CheckCircleFill className={styles.successIcon} />}
        status="success"
        title="缴费成功"
        description={
          <span className={styles.resultAmount}>
            {formatAmountWithSymbol(amount)}
          </span>
        }
      />

      <List className={styles.detail}>
        <List.Item extra={title}>缴费项目</List.Item>
        <List.Item extra={account}>缴费账号</List.Item>
        <List.Item extra={methodLabel[method] ?? method}>支付方式</List.Item>
        <List.Item extra={tradeNo} className={styles.tradeNo}>交易单号</List.Item>
        <List.Item extra={paidTime}>缴费时间</List.Item>
      </List>

      <div className={styles.actions}>
        <Button block fill="outline" onClick={() => navigate('/', { replace: true })}>
          回到首页
        </Button>
        <Button block color="primary" onClick={() => navigate('/records', { replace: true })}>
          查看记录
        </Button>
      </div>
    </div>
  )
}
