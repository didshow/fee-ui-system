import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Toast } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useAuthStore } from '@/store/auth'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [loading, setLoading]       = useState(false)
  const [pwdVisible, setPwdVisible] = useState(false)

  const handleLogin = async (values: { phone: string; password: string }) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    type Account = { phone: string; password: string; userId: string; token: string }
    const accounts: Account[] = (() => {
      try { return JSON.parse(localStorage.getItem('registered-accounts') ?? '[]') }
      catch { return [] }
    })()

    const builtin: Account = { phone: '13800138000', password: '123456abc', userId: 'user-001', token: 'mock-token-abc123' }
    const found = [...accounts, builtin].find(
      (a) => a.phone === values.phone && a.password === values.password
    )

    if (found) {
      login(found.token, found.userId)
      navigate('/', { replace: true })
    } else {
      Toast.show({ icon: 'fail', content: '手机号或密码错误', duration: 2000 })
    }
    setLoading(false)
  }

  return (
    <div className={styles.root}>
      {/* 品牌区 */}
      <div className={styles.header}>
        <div className={styles.logo}>💳</div>
        <h1 className={styles.appName}>智慧缴费</h1>
        <p className={styles.slogan}>便捷 · 安全 · 高效</p>
      </div>

      {/* 登录表单 */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>账号登录</h2>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          footer={
            <Button block type="submit" color="primary" size="large"
              loading={loading} className={styles.submitBtn}>
              登录
            </Button>
          }
        >
          {/* 手机号 */}
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入11位有效手机号' },
            ]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-secondary)', marginRight: 6, fontSize: 14, flexShrink: 0 }}>
                +86
              </span>
              <Input placeholder="请输入手机号" type="tel" maxLength={11} style={{ flex: 1 }} />
            </div>
          </Form.Item>

          {/* 密码 */}
          <Form.Item
            name="password"
            label="登录密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                placeholder="请输入密码"
                type={pwdVisible ? 'text' : 'password'}
                style={{ flex: 1 }}
              />
              <span
                onClick={() => setPwdVisible((v) => !v)}
                style={{ cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '0 4px', flexShrink: 0 }}
              >
                {pwdVisible ? <EyeOutline /> : <EyeInvisibleOutline />}
              </span>
            </div>
          </Form.Item>
        </Form>

        {/* 辅助链接 */}
        <p className={styles.hint}>
          <span
            onClick={() => navigate('/customer-service')}
            style={{ color: 'var(--color-text-tertiary)', cursor: 'pointer' }}
          >
            忘记密码？
          </span>
          <span style={{ color: 'var(--color-border)', margin: '0 8px' }}>|</span>
          <span
            onClick={() => navigate('/register')}
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            没有账号？立即注册
          </span>
        </p>

        {/* 测试账号提示 */}
        <div style={{
          marginTop: 16,
          padding: '10px 14px',
          background: 'var(--color-bg-input)',
          borderRadius: 8,
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          lineHeight: 1.8,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2, color: 'var(--color-text-secondary)' }}>体验账号</div>
          <div>手机号：13800138000　密码：123456abc</div>
        </div>
      </div>
    </div>
  )
}
