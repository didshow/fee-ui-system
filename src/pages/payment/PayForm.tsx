import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, Button, Toast } from 'antd-mobile'
import PageLayout from '@/components/layout/PageLayout'
import { categoryIcon } from '@/utils/mock'
import styles from './PayForm.module.css'

const formConfig: Record<string, {
  title: string
  accountLabel: string
  accountPlaceholder: string
  quickAmounts: number[]
}> = {
  phone: {
    title: '充话费',
    accountLabel: '手机号',
    accountPlaceholder: '请输入手机号码',
    quickAmounts: [30, 50, 100, 200],
  },
  electricity: {
    title: '缴电费',
    accountLabel: '用电户号',
    accountPlaceholder: '请输入用电户号',
    quickAmounts: [50, 100, 200, 500],
  },
  water: {
    title: '缴水费',
    accountLabel: '用水户号',
    accountPlaceholder: '请输入用水户号',
    quickAmounts: [50, 100, 200, 500],
  },
  gas: {
    title: '缴燃气',
    accountLabel: '燃气户号',
    accountPlaceholder: '请输入燃气户号',
    quickAmounts: [50, 100, 200, 500],
  },
  property: {
    title: '缴物业费',
    accountLabel: '房号',
    accountPlaceholder: '请输入房号，如 3-301',
    quickAmounts: [200, 500, 1000, 2000],
  },
  heating: {
    title: '缴暖气费',
    accountLabel: '供热户号',
    accountPlaceholder: '请输入供热户号',
    quickAmounts: [200, 500, 1000, 2000],
  },
  internet: {
    title: '缴宽带费',
    accountLabel: '宽带账号',
    accountPlaceholder: '请输入宽带账号',
    quickAmounts: [50, 100, 200, 300],
  },
}

export default function PayForm() {
  const navigate = useNavigate()
  const { category = 'electricity' } = useParams<{ category: string }>()
  const config = formConfig[category] ?? formConfig.electricity

  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')

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
    <PageLayout title={config.title}>
      <div className={styles.root}>
        <div className={styles.iconArea}>
          <span className={styles.icon}>{categoryIcon[category] ?? '💳'}</span>
          <span className={styles.iconLabel}>{config.title}</span>
        </div>

        <div className={styles.formCard}>
          <Form layout="vertical" footer={null}>
            <Form.Item label={config.accountLabel}>
              <Input
                value={account}
                onChange={setAccount}
                placeholder={config.accountPlaceholder}
                clearable
              />
            </Form.Item>

            <Form.Item label="缴费金额（元）">
              <Input
                type="number"
                value={amount}
                onChange={setAmount}
                placeholder="请输入或选择金额"
                clearable
              />
            </Form.Item>
          </Form>

          <div className={styles.quickAmounts}>
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
        </div>

        <Button
          block
          color="primary"
          size="large"
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          立即缴费
        </Button>
      </div>
    </PageLayout>
  )
}
