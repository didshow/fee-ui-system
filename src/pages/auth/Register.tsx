import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Toast } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useAuthStore } from '@/store/auth'
import { useInviteStore } from '@/store/invite'
import styles from './Login.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterForm {
  phone: string
  password: string
  confirmPassword: string
  email: string
  inviteCode?: string
}

interface MockAccount {
  phone: string
  password: string
  email: string
  userId: string
  token: string
}

// ─── Mock account persistence (localStorage) ─────────────────────────────────

function getAccounts(): MockAccount[] {
  try {
    return JSON.parse(localStorage.getItem('registered-accounts') ?? '[]')
  } catch {
    return []
  }
}

function saveAccount(account: MockAccount): void {
  localStorage.setItem(
    'registered-accounts',
    JSON.stringify([...getAccounts(), account])
  )
}

function phoneExists(phone: string): boolean {
  return getAccounts().some((a) => a.phone === phone)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate      = useNavigate()
  const login         = useAuthStore((s) => s.login)
  const recordInvitee = useInviteStore((s) => s.recordInvitee)

  const [loading, setLoading]           = useState(false)
  const [pwdVisible, setPwdVisible]     = useState(false)
  const [cPwdVisible, setCPwdVisible]   = useState(false)

  async function handleRegister(values: RegisterForm) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    if (phoneExists(values.phone)) {
      Toast.show({ icon: 'fail', content: '该手机号已注册，请直接登录', duration: 2000 })
      setLoading(false)
      return
    }

    const userId = `U${Date.now()}`
    const token  = `tok-${Math.random().toString(36).slice(2)}`

    saveAccount({ phone: values.phone, password: values.password, email: values.email, userId, token })
    if (values.inviteCode?.trim()) {
      recordInvitee(values.inviteCode.trim(), values.phone)
    }
    login(token, userId)
    Toast.show({ icon: 'success', content: '注册成功，欢迎使用！', duration: 1500 })
    navigate('/', { replace: true })
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

      {/* 注册表单 */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>创建账号</h2>

        <Form
          layout="vertical"
          onFinish={handleRegister}
          footer={
            <Button block type="submit" color="primary" size="large"
              loading={loading} className={styles.submitBtn}>
              注册并登录
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
            <Input placeholder="请输入11位手机号" type="tel" maxLength={11} />
          </Form.Item>

          {/* 密码 */}
          <Form.Item
            name="password"
            label="登录密码"
            rules={[
              { required: true, message: '请设置密码' },
              { min: 8, message: '密码不少于8位' },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: '密码须包含字母和数字' },
            ]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                placeholder="8位以上，须含字母和数字"
                type={pwdVisible ? 'text' : 'password'}
                style={{ flex: 1 }}
              />
              <span onClick={() => setPwdVisible((v) => !v)}
                style={{ cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '0 4px', flexShrink: 0 }}>
                {pwdVisible ? <EyeOutline /> : <EyeInvisibleOutline />}
              </span>
            </div>
          </Form.Item>

          {/* 确认密码 */}
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
                validator(_: unknown, value: string) {
                  return !value || getFieldValue('password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('两次密码不一致'))
                },
              }),
            ]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                placeholder="请再次输入密码"
                type={cPwdVisible ? 'text' : 'password'}
                style={{ flex: 1 }}
              />
              <span onClick={() => setCPwdVisible((v) => !v)}
                style={{ cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '0 4px', flexShrink: 0 }}>
                {cPwdVisible ? <EyeOutline /> : <EyeInvisibleOutline />}
              </span>
            </div>
          </Form.Item>

          {/* 邀请码（可选）*/}
          <Form.Item
            name="inviteCode"
            label={
              <span>
                邀请码
                <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--color-text-tertiary)' }}>选填</span>
              </span>
            }
          >
            <Input placeholder="填写好友邀请码，双方各得 50 金币" />
          </Form.Item>

          {/* 绑定邮箱 */}
          <Form.Item
            name="email"
            label={
              <span>
                绑定邮箱
                <span style={{
                  marginLeft: 6, fontSize: 10, fontWeight: 600,
                  background: '#fff1f0', color: 'var(--color-danger)',
                  padding: '1px 6px', borderRadius: 4,
                }}>
                  安全必填
                </span>
              </span>
            }
            rules={[
              { required: true, message: '请绑定邮箱以保障账户安全' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="用于找回密码和安全验证" type="email" />
          </Form.Item>
        </Form>

        {/* 邮箱说明 */}
        <div style={{
          marginTop: 12,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 11,
          color: '#389e0d',
          lineHeight: 1.7,
        }}>
          🔒 邮箱仅用于密码找回和安全验证，不会对外公开或用于营销
        </div>

        <p className={styles.hint}>
          已有账号？{' '}
          <span onClick={() => navigate('/login')}
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>
            立即登录
          </span>
        </p>
      </div>
    </div>
  )
}
