import { useNavigate } from 'react-router-dom'
import { LeftOutline } from 'antd-mobile-icons'
import type { ReactNode } from 'react'
import styles from './PageLayout.module.css'

interface Props {
  title: string
  children: ReactNode
  /** 自定义返回行为，不传则 history.back() */
  onBack?: () => void
  /** 右上角操作区 */
  rightAction?: ReactNode
}

export default function PageLayout({ title, children, onBack, rightAction }: Props) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={styles.root}>
      <header className={styles.navbar}>
        <button className={styles.back} onClick={handleBack} aria-label="返回">
          <LeftOutline />
        </button>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.right}>{rightAction}</div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
