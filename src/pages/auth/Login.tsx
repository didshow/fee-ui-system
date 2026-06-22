import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Toast } from 'antd-mobile'
import { useAuthStore } from '@/store/auth'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: { phone: string; password: string }) => {
    setLoading(true)
    // Mock 登录：固定账号密码，替换为真实 API 时删除此块
    await new Promise((r) => setTimeout(r, 800))

    if (values.phone === '13800138000' && values.password === '123456') {
      login('mock-token-abc123', 'user-001')
      navigate('/', { replace: true })
    } else {
      Toast.show({ icon: 'fail', content: '手机号或密码错误' })
    }
    setLoading(false)
  }

  return (
    <div className={styles.root}>
      {/* 顶部品牌区 */}
      <div className={styles.header}>
        <div className={styles.logo}>💳</div>
        <h1 className={styles.appName}>智慧缴费</h1>
        <p className={styles.slogan}>便捷 · 安全 · 高效</p>
      </div>

      {/* 登录表单卡片 */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>账号登录</h2>
        <Form
          layout="vertical"
          onFinish={handleLogin}
          footer={
            <Button
              block
              type="submit"
              color="primary"
              size="large"
              loading={loading}
              className={styles.submitBtn}
            >
              登录
            </Button>
          }
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input placeholder="请输入手机号" type="tel" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
        </Form>
        <p className={styles.hint}>测试账号：13800138000 / 123456</p>
      </div>
    </div>
  )
}
